Hi Erika! Here be MAPPINGS!!

## Data File and Variable Mappings
Which .js files correspond with the new .csv files. Within each file, 
which .js variables corresponds to which .csv.

* data_county.js
    * sparkline_domain -> year_limits.csv
    * titles_county -> county_context.csv
    * data_county -> county_data.csv

* data_region.js
    * titles_region -> region_context.csv AND state_context.csv
    * data_region -> region_data.csv AND state_data.csv
    
**NOTE**: State data were meshed with region data in the .js files. It is
separated in the .csv files.

## Variable Name Mappings
.js variable naming -> .csv column naming. The .js variable names are
listed in order of occurrence in the data files.

**NOTE**: There is some hierarchy here that I haven't captured. Let me know
if this is troublesome for you. -Brian

* titles -> context (e.g., titles_county -> county_context.csv)
    * NO NAME -> group (type of measure, trend or fact)
    * NO NAME -> code_name (code-friendly name for a specific measure)
    * title -> pretty_name (UI friendly name for a specific measure)
    * valueFormat -> value_format
    * min -> global_min (min across all targets, e.g., counties + years)
    * max -> global_max
    * minCurrent -> current_min (min across all targets for latest year)
    * maxCurrent -> current_max
    
* data -> data (e.g., data_region -> region_data.csv)
    * id -> code_location (code friendly geo name, e.g., Region_1_North)
    * title -> pretty_location (UI friendly geo name, e.g., Region 1 North)
    * NO NAME -> group (type of measure, trend or fact)
    * id -> code_name (code-friendly name for a specific measure)
    * statistic -> NOT TRANSFERRED (it's just to link the time and value)
    * time -> date
    * value -> value