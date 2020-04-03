import React from 'react';
import * as d3 from 'd3';
import Papa from 'papaparse';

export default class DonutChart extends React.Component {
    constructor() {
        super();
        this.state = {
            data : [],
            districts : []
        }
    }

    //Parse csv file
    componentDidMount() {
        const csvFilePath = require("./data/data.csv");

        Papa.parse(csvFilePath, {
          header: true,
          download: true,
          skipEmptyLines: true,
          complete: this.updateData //send data to be stored
        });
      }
    
    //Store data in component state
    updateData = (result) => {
        this.setState({data: result.data});
        this.saveByDistric(result.data);
    }

    //Create array with districs and crimes commited
    saveByDistric = (data) => {
        const districtCount = [];
        let index = 0;
        const districts = []
        for(let item of data) {
            if(!districts.includes(item.district)) {
                districts[index] = item.district;
                districtCount[index] = {label: item.district, value: 1}
                index++;
            } else {
                districtCount[districts.indexOf(item.district)].value++;
            }
        }
        this.setState({districts : districtCount}); 
    }

    render() {
        return <div id='canvas'/>
    }
}