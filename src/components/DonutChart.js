import React from 'react';
import * as d3 from 'd3';
import Papa from 'papaparse';
import KeyCheckboxes from './KeyCheckboxes';

export default class DonutChart extends React.Component {
    constructor() {
        super();
        this.state = {
            data : [],
            districts : [],
            showKeys: [],
            width: 600,
            height: 400,
            canvas: d3.select('#canvas')
        }
    }

    //Parse csv file
    componentDidMount() {
        const csvFilePath = require("./data/data.csv");

        Papa.parse(csvFilePath, {
          header: true,
          download: true,
          skipEmptyLines: true,
          complete: this.saveData //send data to be stored
        });

        this.drawCanvas();
      }

    //Create array with districs and crimes commited
    //and array of districts and checked boolean
    saveData = (result) => {
        const data = [...result.data]
        const districtCount = [];
        let index = 0;
        const districts = [];
        const setShowKeys = [];

        for(let item of data) {
            if(!districts.includes(item.district)) {
                districts[index] = item.district;
                districtCount[index] = {label: item.district, value: 1}
                setShowKeys[index] = {district: item.district, checked: true};
                index++;
            } else {
                districtCount[districts.indexOf(item.district)].value++;
            }
        }

        //Sort arrays
        setShowKeys.sort((a,b) => Number(a.district) - Number(b.district));
        districtCount.sort((a,b) => Number(a.label) - Number(b.label));
        
        this.setState({districts: districtCount});
        this.setState({data: districtCount});
        this.setState({showKeys: setShowKeys});
    }

    //Check or uncheck checkboxes and call updateData
    handleChange = (e, index) => {
        const alterArr = [...this.state.showKeys]
        if(alterArr[index].checked) {
            alterArr[index].checked = false;
        } else {
            alterArr[index].checked = true;
        }

        this.setState({showKeys: alterArr});
        this.updateData(alterArr);
    }
    
    //Put all of the data to be displayed in the data array
    updateData = (showKeys) => {
        const data = this.state.districts.map((item, i) => {
            return this.state.showKeys[i].checked ? item : {label: item.district, value: 0};
        })

        this.setState({data: data});
    }

    //Draw blank canvas
    drawCanvas = () => {
        const {height, width} = this.state;

        const canvas = d3.select('#canvas')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
                .attr('transform', `translate(${width / 2}, ${height / 2})`);

        this.setState({canvas: canvas});
        this.drawKey(canvas);
    }

    //Draw and update pie chart slices
    drawSlices = (s) => {
        const {height, width, canvas, data} = this.state;
        const radius = Math.min(height, width) / 2;

        const color = d3.scaleOrdinal().range(["#A7226E", "#EC2049","#F26B38", "#cc3300", "#F7DB4F", "#2F9599"]);
        
        const arc = d3.arc()
            .innerRadius(radius * 0.5)
            .outerRadius(radius);

        const pie = d3.pie()
            .value(function (d) {
                return d.value;
            })
            .sort(null);
        
        const slice = canvas.selectAll("path")
            .data(pie(data)); 

        slice.enter()
                .insert('path')
                .attr('d', arc)
                .style('fill', (d,i) => color(i))

        slice.transition().duration(1000)
            .attrTween("d", function (d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) {
                    return arc(interpolate(t));
                };
            })

		slice.exit()
			.remove();
    }

    //Draw key for districts
    drawKey = (canvas) => {
        const {height, width} = this.state;
        
        const color = d3.scaleOrdinal().range(["#A7226E", "#EC2049","#F26B38", "#cc3300", "#F7DB4F", "#2F9599"]);
        const keys = [1,2,3,4,5,6];

        const squares = canvas.selectAll("circle")
            .data(keys); 

        //Color square
        squares.enter()
                .append('circle')
                .attr("r", 6)
                .attr('cx', -35)
                .attr('cy', d => d*20 - 70)
                .style('fill', (d,i) => color(i))
        
        //Text
        canvas.selectAll("text")
            .data(keys)
            .enter()
                .append("text")
                .text(d => `District ${d}`)
                .attr("x", -20)
                .attr("y", (d, i) => (d * 20) -64)
    }

    render() {
        this.drawSlices();
        return (
            <div class='container'>
                <h3>Sacremento Crime Rates by District - 2006</h3>
                <div id='canvas'/>
                <KeyCheckboxes showKeys={this.state.showKeys} handleChange={this.handleChange}/>
            </div>
        )
    }
}