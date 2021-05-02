import {parse} from 'dirty-json'
import _ from 'lodash'
import swal from 'sweetalert2'

export const formater = (input) => {

    const inputDataArray = input.split("\n").filter(item=> item !== "")
    // deleting empty spaces and returning error if has a invalid object
    const arrayWithValidObjects = inputDataArray.map((value) => {
        try {
            return parse(value.replace('},', "}"))
        }
        catch(err) {
            showErrorMessage()
            return [null,null]
        }
    })

    const [start] = arrayWithValidObjects.filter(item => item.type === "start")
    const [stop] = arrayWithValidObjects.filter(item => item.type === "stop")
    const [span] = arrayWithValidObjects.filter(item => item.type === "span")
    const data = arrayWithValidObjects.filter(item => item.type === "data")
    
    if (start === undefined || stop === undefined || span === undefined || data === [] ) {
        showErrorMessage()
        return [null,null]
    }   
    const labels = convertTimestampToMinutesAndSeconds(start.timestamp, stop.timestamp ) 
    const validatedData = validateVisibleData(data, span.begin, span.end)
    const sanitizedDataToChat = sanitizeData(validatedData)

    // At this point I crashed when I tried to group the data, something like
    // "Linux Chrome: {"xxx","xxx"}"
    // so I decided to search for a library to manipulate the data, and I founded lodash.
    // I saw that i could use from the beginning but I decided not to refactor the 
    // functions for a better appreciation.
    const groupedData = _.groupBy(sanitizedDataToChat, data => data.title);

    const minResponseData = createArrayWithMinResponseValues(Object.values(groupedData))
    const maxResponseData = createArrayWithiMaxResponsevalues(Object.values(groupedData))

    const dataset = createChartDataetConfig([...minResponseData, ...maxResponseData])
    return [dataset, labels]
}

// Get start and stop time to create the chart labels config 
function convertTimestampToMinutesAndSeconds(start, stop) {
    const startTime = transform(start)
    const stopTime = transform(stop)

    function transform(time) {
        let data = new Date(time)
        let minutes = String(data.getMinutes()).padStart(2,'0')
        let seconds = String(data.getSeconds()).padStart(2,'0')

        return `${minutes}:${seconds}`
    }


    return [`${startTime}`, `${stopTime}`]
}

// Function to check if data timestamp is between 'begin' and 'end' timestamp.
function validateVisibleData (data, begin, end) {
    const validatedData = data.filter( item => item.timestamp >= begin && item.timestamp <= end )
    return validatedData
}

// Clear data to make logic to insert on the chart
function sanitizeData(data) {
    const obj = data.map((item)=> {
            let os = capitalizeStrings(item.os)
            let browser = capitalizeStrings(item.browser)
            let minTime = item.min_response_time
            let maxTime = item.max_response_time

            return {
                title: `${os} ${browser}`,
                min_response_time: minTime,
                max_response_time: maxTime,
                timestamp: item.timestamp
            }            
    })
    
    return obj

}

// Function to capitalize data. Ex: from "linux" to "Linux"
function capitalizeStrings(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

// Function to create the array with the min_response_values
function createArrayWithMinResponseValues(values) {
    const minValues = values.map(item=> {
        const obj = {...item}
        let data;
        let arrayWithMinresponsetimeValues = []

        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                const element = obj[key];
                arrayWithMinresponsetimeValues.push(element.min_response_time)
            }
        }
        // getting min_response_time from minor to higher
        let [minor, biggest] = getMinMaxValues(arrayWithMinresponsetimeValues)

        data = [{x:minor}, {x:biggest}]

        return {
            label: `${obj[0].title} ${Object.keys(obj[0])[1]}`,
            data,
            timestamp: [item[0].timestamp, item[item.length - 1].timestamp]
        }
    })

    return minValues
}

// Function to create the array with the min_response_values
function createArrayWithiMaxResponsevalues(values) {

    const maxValues = values.map(item=> {

        const obj = {...item}
        let data;
        let arrayWithMaxresponsetimeValues = []

        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                const element = obj[key];
                arrayWithMaxresponsetimeValues.push(element.max_response_time)
            }
        }

        let [minor, biggest] = getMinMaxValues(arrayWithMaxresponsetimeValues)

        data = [{x:minor}, {x:biggest}]

        return {
            label: `${obj[0].title} ${Object.keys(obj[0])[2]}`,
            data,
            timestamp: [item[0].timestamp, item[item.length - 1].timestamp]
        }
    })

    return maxValues
}

// Return the dataset object, the items to plot the chart
function createChartDataetConfig(data) {

const charData = data.map(item=> {
    
    // Generating random color: Generate a random number | Turn to hexadecimal | Add six '0' to fill
    // the hexadecimal color if it was necessary (needs to have 6 character)
    const randomColor = "#"+Math.floor(Math.random() * 2 ** 24).toString(16).padStart(6, "0");

    return {
        label: item.label,
        data: [{x: item.timestamp[0] , y:item.data[0].x}, {x: item.timestamp[1] , y:item.data[1].x}],
        backgroundColor: randomColor,
        borderColor: randomColor,
        pointBorderWidth: 5,
        pointHoverRadius: 5,
        borderWidth: 4
    }
})

const dataset = []
charData.forEach(item=> {
    dataset.push(item)
})

return dataset
}

// Auxiliary function to return the biggest and the minor value from an array
function getMinMaxValues(array) {

let biggest = array.reduce(function(a,b) {
    return Math.max(a,b);
});

let minor = array.reduce(function(a,b) {
    return Math.min(a,b);
});

return [minor, biggest]
}

// Function to show the error message.
function showErrorMessage() {
swal.fire({
    title: "Ops... Invalid data!!",
    text: 'Please insert all data types: start, span, data and stop, and just a kind of data for line.',
    icon: 'error'
})
}