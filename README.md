# County Dashboard
## Project Purpose
The county dashboard allows the user to toggle between region, county, and state 
views of data on a number of key metrics. It also allows you to update the
map to show geographic variation for each metric.

## Implementation Overview
The county dashboard is implemented as a JavaScript application that reads
JavaScript data files containing JSON-style data **(to be replaced by JSON
files)**. It is currently standalone and may need adjustments for integration 
into the new Data Portal.

## Assets
* CSS
	* styles.css
	Provides application styling.

* JavaScript
	* `d3_VERSION_NUMBER.min.js` (3rd party)
	
		The minimized core D3 file obtained from 
		(the D3 website)[http://d3js.org/].
	
	* `d3_tip_VERSION_NUMBER.js` (3rd party)
	
		A D3 file that supports adding tooltips to d3.js visualizations. 
		Obtained from [the Caged GitHub repo](https://github.com/caged/d3-tip).
	
	* `app.js`
	
		The file the declares global variables and initializes the application
        containers and their behavior. Has dependencies on all the following
        files and so needs to be loaded last.
	
	* `fastfact_functions.js`
	
		Supports creation of the fast facts at the bottom of the visualization.
    
    * `sparkline_functions.js`
    
        Supports creation of the sparklines at the right of the visualization.
        
    * `map_functions.js`
    
        Supports creation and updating of the map objects.
        
    * `scope_funtions.js`
    
        Supports switching between views and the data those views need.
        
    * `fastfact_sparkline_tooltip_functions.js`
    
        Supports creating and populating the fastfact and sparkline tooltips.

## Data
* JavaScript
	* `data_county.js` **(conversion needed)**
	
		Several arrays of data for counties stored as variables, as well as the 
		sparkline domain (needs to be updated when the data is updated).
        
        This provides the content for fast facts, sparklines, and the 
        scaled map.
	
	* `data_region.js` **(conversion needed)**
	
		Same as above but for regions.
        
    * `wa_county_geodata.js` **(conversion needed)**
    
        The data used to define the spaces and lines for each county on the
        county map.
    
    * `wa_region_geodata.js` **(conversion needed)**
    
        Same as above but for regions.
	
	* `dict.js` **(conversion needed)**
	
		Defines assorted application features ("small counties" array, titles
		and descriptions for fast facts and population brackets).

## Data Generation
**The data generation process for this application is currently being updated as
follows.**

Data is extracted from POC databases and prepared for the application using R
and the `pocr` package.

### Update Schedule
Quarterly updates for CA data. Yearly updates for contextual data.

### POC Databases and Schemas Used

### Data Generation Process
The `pocr` package [is available](https://github.com/pocdata/pocr/tree/master/R)
for inspection, though viewing it requires access to the POC pocdata account
on GitHub.

The `pocr` package can be installed using the `devtools` package (pocdata 
membership not required).

```
devtools::install_github("pocdata/pocr")
```

To update the data, install `pocr` and use the `update_r_apps` function. 

The basic version of the `update_r_apps` function will require pocdata access, 
as it generates new data for the specified apps and pushes that data to the
relevant repo(s). 

```
# to update all applications supported by pocr (will request credentials for
# a GitHub account with pocdata access)
pocr::update_r_apps()

# to update a specific application or set of applications (same credential
# request
pocr::update_r_apps("app_repo_name")
```

Alternatively, you can create a local copy of the requested data by setting
`local_copy = TRUE`.

```
# creates a local copy of the app data - does not update GitHub and so no
# credentials needed
pocr::update_r_apps("app_repo_name", local_copy = TRUE)
```