import moment from 'moment'


export function handleSearch(array, fieldName, searchQuery) {
    return array.filter((item, index) => {
        let filtered = fieldName.filter(element => {
            let searchele = JSON.stringify(item[element])
            return searchele?.toLowerCase().includes(searchQuery?.toLowerCase());
        });

        return filtered.length > 0 ? true : false
        // return item[element]?.toLowerCase().includes(searchQuery?.toLowerCase());

    });
}

export function handleFilterTwoDates(array, fieldName, start, end) {
    return array.filter((item, index) => {
        const date = moment(item[fieldName])
        console.log('date', date.format('DD/MM/YYYY'), moment(start).isBefore(date) && moment(end).isAfter(date))
        return moment(start).isBefore(date) && moment(end).isAfter(date)
    })
}