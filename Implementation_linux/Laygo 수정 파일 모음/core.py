# bag_workspace_gpdk045\laygo3\laygo2\interface\core.py
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
This module implements interfaces with external cad environments.
"""

import numpy as np
#import laygo2.object
from . import bag  #import laygo2.interface.bag
from . import mpl  #import laygo2.interface.mpl
from . import bokeh #import laygo2.interface.bokeh

#Added for webconsole
from . import webconsole
import os

# Type checking
from typing import TYPE_CHECKING, overload, Generic, Dict
from typing import List, Tuple, Iterable, Type, Union, Any, Optional
from laygo2._typing import T, FilePath
if TYPE_CHECKING:
    import laygo2

def export(
    # Common parameters
    db: "laygo2.object.database.Library",
    cellname: str = None,
    target = None,
    tech: "laygo2.object.technology.BaseTechnology" = None,
    filename: str = None,
    scale = None,
    # BAG parameters
    reset_library = None,
    tech_library = None,
    # MPL and Bokeh parameters
    colormap: dict = None,
    order = None,
    xlim: list = None,
    ylim: list = None,
    show: bool = None,
    annotate_grid: List["laygo2.object.physical.Grid"] = None,
):
    """
    Export the database to the target environment specified by target or laygo2_tech.

    This function exports the design database to various target environments such as bag or matplotlib(mpl).
    The target environment can be specified directly or inferred from the technology parameters.

    Parameters
    ----------
    db : laygo2.object.database.Library
        The design database to be exported.
    cellname : str, optional
        The name of the cell to be exported. If None, the entire database is exported.
    target : str, optional
        The target environment for export (such as bag or mpl). 
        If None, the default target from the technology parameters is used.
    tech : object, optional
        The technology object containing technology-specific parameters.
    filename : str, optional
        The name of the file to save the exported data. If None, a default name is used.
    scale : float, optional
        The scale factor for the exported data.
    reset_library : bool, optional
        BAG-specific parameter. If True, the library is reset before export.
    tech_library : str, optional
        BAG-specific parameter. The name of the technology library.
    colormap : dict, optional
        MPL-specific parameter. A dictionary defining the colormap for the export.
    order : list, optional
        MPL-specific parameter. The order in which to export the elements.
    xlim : list, optional
        MPL-specific parameter. The x-axis limits for the export.
    ylim : list, optional
        MPL-specific parameter. The y-axis limits for the export.
    show : bool, optional
        MPL-specific parameter. If True, the exported data is displayed.
    annotate_grid : list of laygo2.object.physical.Grid, optional
        MPL-specific parameter. A list of grids to annotate in the export.

    Returns
    -------
    None

    Raises
    ------
    ValueError
        If the target environment is not supported.

    Notes
    -----
    The function determines the target environment based on the provided parameters and exports
    the design database accordingly. If no target is specified, the default target from the
    technology parameters is used.

    Example
    -------
    >>> import laygo2
    >>> # Create a design database.
    >>> db = laygo2.Library(name='mylib')
    >>> # Export the database to GDS.
    >>> laygo2.export(db, cellname='mycell', target='gdspy', filename='mycell.gds', scale=0.001)
    """

    if tech is not None:
        tech_params = tech.tech_params
    else:
        tech_params = {}

    if target is None:  # use the default tech
        if 'export' in tech_params:
            target = tech_params['export']['target']
        else:
            target = 'bag'  # use bag export if nothing is specified for target.

    # export functions
    if target == 'bag':  # bag export
        if scale is None:
            scale = tech_params['export']['bag']['scale']
        if reset_library is None:
            reset_library = tech_params['export']['bag']['reset_library']
        if tech_library is None:
            tech_library = tech_params['export']['bag']['tech_library']
        return bag.export(
            db=db,
            filename=filename,
            cellname=cellname,
            scale=scale,
            reset_library=reset_library,
            tech_library=tech_library
        )
    elif target == 'mpl':  # mpl export
        if colormap is None:
            colormap = tech_params['export']['mpl']['colormap']
        if order is None:
            order = tech_params['export']['mpl']['order']
        if show is None:
            if 'show' in tech_params['export']['mpl']:
                show = tech_params['export']['mpl']['show']
            else:
                show = False
        
        if filename is not None:
            if filename.endswith('.png'):
                filename = filename[:-4]
            filename = filename + '.png'

        return mpl.export(
            db=db,
            colormap=colormap,
            order=order,
            xlim=xlim,
            ylim=ylim,
            show=show,
            filename=filename,
            annotate_grid=annotate_grid
        )
    elif target == 'bokeh':  # bokeh export
        if 'bokeh' in tech_params['export']:
            key = 'bokeh'
        else:
            key = 'mpl'
        if colormap is None:
            colormap = tech_params['export'][key]['colormap']
        if show is None:
            if 'show' in tech_params['export'][key]:
                show = tech_params['export'][key]['show']
            else:
                show = False
        
        if filename is not None:
            if filename.endswith('.png'):
                filename = filename[:-4]
            filename = filename + '.png'

        return bokeh.export(
            db=db,
            colormap=colormap,
            xlim=xlim,
            ylim=ylim,
            show=show,
            filename=filename,
            annotate_grid=annotate_grid
        )
    elif target == 'webconsole':  # webconsole export
        consoleUsername = os.environ['LAYGO_USERNAME']
        
        return webconsole.export(
            db=db,
            username = consoleUsername,
            tech = tech
        )


