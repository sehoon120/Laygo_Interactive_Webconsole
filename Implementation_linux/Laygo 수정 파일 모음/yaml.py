#bag_workspace_gpdk045\laygo3\laygo2\interface\yaml.py
#!/usr/bin/python
########################################################################################################################
#
# Copyright (C) 2023, Nifty Chips Laboratory at Hanyang University - All Rights Reserved
# 
# Unauthorized copying of this software package, via any medium is strictly prohibited
# Proprietary and confidential
# Written by Jaeduk Han, 07-23-2023
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
# INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
# SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
# SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
# WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#
########################################################################################################################

"""
This module implements interfaces with yaml files.

"""

__author__ = "Jaeduk Han"
__maintainer__ = "Jaeduk Han"
__status__ = "Prototype"

import yaml
import os.path
import laygo2

# Type checking
from typing import TYPE_CHECKING, overload, Generic, Dict
from typing import List, Tuple, Iterable, Type, Union, Any, Optional
from laygo2._typing import T, FilePath
from pymongo import MongoClient     #Modified for webconsole
import datetime
if TYPE_CHECKING:
    import laygo2

def export_template(
        template:"laygo2.object.template.Template", 
        filename:str, 
        mode:str='append',
        export_mask:bool=False,
        export_prelvs_info:bool=False,
        export_internal_shapes:bool=False,
        ):
    """Export a template to a yaml file.

    Parameters
    ----------
    template: laygo2.object.template.Template or laygo2.object.database.Design
        The template object to be exported. If laygo2.Design is given, it is converted to a template and exported.
    filename: str
        The name of the yaml file.
    mode: str
        If 'append', it adds the template entry without erasing the 
        preexisting file.

    Example
    -------
    >>> import laygo2
    >>> from laygo2.object.physical import Pin
    >>> from laygo2.object.template import NativeInstanceTemplate
    >>> p = dict()
    >>> p['i'] = Pin(xy=[[0, 0], [10, 10]], layer=['M1', 'drawing'],
    >>>                  netname='i')
    >>> p['o'] = Pin(xy=[[90, 90], [100, 100]], layer=['M1', 'drawing'],
    >>>                  netname='o')
    >>> nt = NativeInstanceTemplate(libname='mylib', cellname='mytemp',
    >>>                                 bbox=[[0, 0], [100, 100]], pins=p)
    >>> laygo2.interface.yaml.export_template(nt, filename="mytemplates.yaml")    
    Your design was translated into YAML format.
    {'mylib': {
        'mytemp': {
            'libname': 'mylib', 
            'cellname': 'mytemp', 
            'bbox': [[0, 0], [100, 100]], 
            'pins': {
                'i': {
                    'xy': [[0, 0], [10, 10]], 
                    'layer': ['M1', 'drawing'], 
                    'name': None, 
                    'netname': 'i'
                    }, 
                'o': {
                    'xy': [[90, 90], [100, 100]], 
                    'layer': ['M1', 'drawing'], 
                    'name': None, 
                    'netname': 'o'
    }}}}}
    """
    if (template.__class__.__name__ == "Design"):  # if design is provided, convert it to template
        template = template.export_to_template(export_prelvs_info=export_prelvs_info, export_internal_shapes=export_internal_shapes)

    libname = template.libname
    cellname = template.cellname
    pins = template.pins()

    db = dict()

    if os.getenv('WC') is None:
        # load yaml file from local
        if mode == 'append':  # in append mode, the template is appended to 'filename' if the file exists.
            if os.path.exists(filename):
                with open(filename, 'r') as stream:
                    db = yaml.load(stream, Loader=yaml.FullLoader)
            else:
                f_new = open(filename, "w")
                f_new.write(f"{libname}:\n")
                f_new.write(f"    dummy:\n")
                f_new.write(f"        bbox:\n")
                f_new.write(f"        - - 0\n")
                f_new.write(f"          - 0\n")
                f_new.write(f"        - - 0\n")
                f_new.write(f"          - 0\n")
                f_new.write(f"        cellname: dummy\n")
                f_new.write(f"        libname: {libname}\n")

                f_new.close()
                with open(filename, 'r') as stream:
                    db = yaml.load(stream, Loader=yaml.FullLoader)

        if libname not in db:
            db[libname] = dict()
        db[libname][cellname] = template.export_to_dict(export_mask=export_mask, export_prelvs_info=export_prelvs_info, export_internal_shapes=export_internal_shapes)
        with open(filename, 'w') as stream:
            yaml.dump(db, stream, default_flow_style=None)
        #print("Your design was translated into YAML format.")
    else:
        # load yaml file from db server
        print("webconsole mode")
        username = os.environ['LAYGO_USERNAME']
        if mode == 'append':  # in append mode, the template is appended to 'filename' if the file exists.
            filepath_split = filename.split('/')[:-1]
            filePath = '/'.join(filename.split('/')[:-1])+'/'
            filename = filename.split('/')[-1].split('.')[0]

            DB_CONNECT = os.environ['DB_CONNECT']
            client = MongoClient(DB_CONNECT)
            #print(client)
            testdb = client.test
            collection = testdb['files']
            tz = datetime.timezone(datetime.timedelta(hours=9))

            yamlFile = collection.find_one({'user': username, 'filetype': 'yaml', 'filename': filename, 'filePath': filePath})

            if yamlFile is not None:
                db = yaml.load(yamlFile['content'], Loader=yaml.FullLoader)
            else:
                dummy_string = f"{libname}:\n"
                dummy_string += f"    dummy:\n"
                dummy_string += f"        bbox:\n"
                dummy_string += f"        - - 0\n"
                dummy_string += f"          - 0\n"
                dummy_string += f"        - - 0\n"
                dummy_string += f"          - 0\n"
                dummy_string += f"        cellname: dummy\n"
                dummy_string += f"        libname: {libname}\n"
                db = yaml.safe_load(dummy_string)
                testdb.files.insert_one({'user': username, 'filetype': 'yaml', 'filename': filename, 'filePath': filePath, 'content':"", 'updatedAt': datetime.datetime.now(tz=tz)})

        if libname not in db:
            db[libname] = dict()
        db[libname][cellname] = template.export_to_dict()
        yaml_string = str()
        yaml_string = yaml.dump(db, default_flow_style=None)
        testdb.files.update_one({'user': username, 'filetype': 'yaml', 'filename': filename, 'filePath': filePath}, {'$set':{'content':yaml_string, 'updatedAt': datetime.datetime.now(tz=tz)}})
    
    return db

#filename=libname+'_templates.yaml'

def import_template(filename:str):
    """Import templates from a yaml file.

    Parameters
    ----------
    filename: str
        The name of the yaml file.
    
    Example
    -------
    >>> import laygo2
    >>> from laygo2.object.physical import Pin
    >>> from laygo2.object.template import NativeInstanceTemplate
    >>> p = dict()
    >>> p['i'] = Pin(xy=[[0, 0], [10, 10]], layer=['M1', 'drawing'],
    >>>                  netname='i')
    >>> p['o'] = Pin(xy=[[90, 90], [100, 100]], layer=['M1', 'drawing'],
    >>>                  netname='o')
    >>> nt = NativeInstanceTemplate(libname='mylib', cellname='mytemp',
    >>>                                 bbox=[[0, 0], [100, 100]], pins=p)
    >>> laygo2.interface.yaml.export_template(nt, filename="mytemplates.yaml")    
    >>> # Import the template back to python.
    >>> my_tlib = laygo2.interface.yaml.import_template("mytemplates.yaml")
    >>> print(my_tlib)
    <laygo2.object.database.TemplateLibrary object at 0x000001FE3440A410> 
        name: mylib, 
        params: None       
        elements: {
            'mytemp': <laygo2.object.template.NativeInstanceTemplate object at 0x000001FE3440A2C0>
        }
    """
    #Modify: check webconsole environment
    if os.getenv('WC') is None:
        # load yaml file from local
        if os.path.exists(filename):
            with open(filename, 'r') as stream:
                db = yaml.load(stream, Loader=yaml.FullLoader)
        else:
            print("no such file: "+filename)
    else:
        # load yaml file from db server
        print("webconsole mode")
        username = os.environ['LAYGO_USERNAME']
        print(filename)
        filepath_split = filename.split('/')[:-1]
        filePath = '/'.join(filename.split('/')[:-1])+'/'
        filename = filename.split('/')[-1].split('.')[0]

        DB_CONNECT = os.environ['DB_CONNECT']
        client = MongoClient(DB_CONNECT)
        testdb = client.test
        collection = testdb['files']
        yamlFile = collection.find_one({'user': username, 'filetype': 'yaml', 'filename': filename, 'filePath': filePath})
        if yamlFile is not None:
            db = yaml.load(yamlFile['content'], Loader=yaml.FullLoader)
            #print(db)
        else:
            print("no such file: "+filePath+"/"+filename)
    
    libname = list(db.keys())[0]  # assuming there's only one library defined in each file.
    # create template library
    tlib = laygo2.object.database.TemplateLibrary(name=libname)
    # read out the yaml file entries and build template objects
    for tn, tdict in db[libname].items():
        pins = dict()
        if 'pins' in tdict:
            for pinname, pdict in tdict['pins'].items():
                pins[pinname] = laygo2.object.physical.Pin(xy=pdict['xy'], layer=pdict['layer'], netname=pdict['netname'])
        masks = tdict.get('masks', None)
        internal_shapes = tdict.get('internal_shapes', None)
        t = laygo2.object.template.NativeInstanceTemplate(libname=libname, cellname=tn, bbox=tdict['bbox'], masks=masks, pins=pins, internal_shapes=internal_shapes)
        tlib.append(t)
    return tlib

