# County Dashboard
## Project Purpose
The county dashboard allows the user to toggle between region, county, and state 
views of data on a number of key metrics.

## Implementation Overview
The county dashboard is implemented as a JavaScript application that reads
JavaScript data files containing JSON-style data ***(to be replaced by JSON
files**. It is currently standalone and may need adjustments for integration 
into the new Data Portal.

## Assets
* CSS
	* styles.css
	Provides application styling.

* JavaScript
	* `d3_VERSION_NUMBER.js` (3rd party)
	
		The core D3 file obtained from (website name)[link].
	
	* `d3_tip_VERSION_NUMBER.js` (3rd party)
	
		A D3 file that supports adding tooltips to d3.js visualizations. 
		Obtained from [the Caged GitHub repo](https://github.com/caged/d3-tip).
	
	* `population.js` **(merge target)**
	
		Supports creation of population brackets at bottom of the dashboard.
	
	* `sparkline.js` **(merge target)**
	
		Supports creation of sparkline charts on the side of the dashboard.
	
	* `wa_geo_map.js` **(function/data separation needed)**
	
		Supports creation of county map. Also currently provides the map GeoJSON 
		data.
	
	* `wa_geo_map_region.js` **(function/data separation needed)**
	
		Supports creation of region map. Also currently provides the map GeoJSON 
		data.

## Data
* JavaScript
	* `data_county.js` **(conversion needed)**
	
		Several arrays of data for counties stored as variables, as well as the 
		sparkline domain (needs to be updated when the data is updated).
	
	* `data_region.js` **(conversion needed)**
	
		Same as above but for regions and minus the sparkline domain.
	
	* `dict.js` **(conversion needed)**
	
		Defines assorted application features ("small counties" array, titles
		and descriptions for fast facts and population brackets).

## Data Generation
**The data generation process for this application is currently being updated as
follows.**

Data is extracted from POC databases and prepared for the application using R
and the `pocr` package.

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