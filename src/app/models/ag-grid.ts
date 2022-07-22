export interface IColumnDef {
    headerName: string;
    field: string;
}

// Utility function used to pad the date formatting.
export function pad(num, totalStringSize) {
    let asString = num + '';
    while (asString.length < totalStringSize) { asString = '0' + asString; }
    return asString;
}

export function sortAndFilter(allOfTheData, sortModel, filterModel) {
    return sortData(sortModel, filterData(filterModel, allOfTheData));
}

function sortData(sortModel, data) {
    const sortPresent = sortModel && sortModel.length > 0;
    if (!sortPresent) {
        return data;
    }
    const resultOfSort = data.slice();
    resultOfSort.sort(function(a, b) {
        for (let k = 0; k < sortModel.length; k++) {
            const sortColModel = sortModel[k];
            const valueA = a[sortColModel.colId];
            const valueB = b[sortColModel.colId];
            if (valueA == valueB) {
                continue;
            }
            const sortDirection = sortColModel.sort === 'asc' ? 1 : -1;
            if (valueA > valueB) {
                return sortDirection;
            } else {
                return sortDirection * -1;
            }
        }
        return 0;
    });
    return resultOfSort;
}

export function filterData(filterModel, data) {
    const filterPresent = filterModel && Object.keys(filterModel).length > 0;
    if (!filterPresent) {
        return data;
    }
    const resultOfFilter = [];
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (filterModel.age) {
            const age = item.age;
            const allowedAge = parseInt(filterModel.age.filter);
            if (filterModel.age.type === 'equals') {
                if (age !== allowedAge) {
                    continue;
                }
            } else if (filterModel.age.type === 'lessThan') {
                if (age >= allowedAge) {
                    continue;
                }
            } else {
                if (age <= allowedAge) {
                    continue;
                }
            }
        }
        if (filterModel.year) {
            if (filterModel.year.values.indexOf(item.year.toString()) < 0) {
                continue;
            }
        }
        if (filterModel.country) {
            if (filterModel.country.values.indexOf(item.country) < 0) {
                continue;
            }
        }
        resultOfFilter.push(item);
    }
    return resultOfFilter;
}
