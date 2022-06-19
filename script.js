let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let tableData = [];
let svg = d3.select('svg');
let tooltip = d3.select('#tooltip');

async function getData() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            tableData = data;
            setCanvas();
            setScale();
            setPoint();
        })
}

let w = window.innerWidth * 0.8;
let h = window.innerHeight * 0.8;
let padding = 40;
let xScale;
let yScale;

let setCanvas = () => {
    svg.attr('width', w)
        .attr('height', h);
    svg.append('text')
        .attr('id', 'title')
        .text('Doping in Professional Bicycle Racing')
        .attr('x', w/2)
        .attr('y', (h - (h * 0.9)))
        .attr('text-anchor', 'middle')
        .attr('font-size', h/15)
        .attr('fill', 'white');
}

let setScale = () => {
    yScale = d3.scaleTime()
        .domain([d3.min(tableData, x => {
            return new Date (x.Seconds * 1000);
        }), d3.max(tableData, x => {
            return new Date (x.Seconds * 1000);
        })])
        .range([padding, h - padding])

    xScale = d3.scaleLinear()
        .domain([d3.min(tableData, x => {
            return x.Year;
        }) - 1, d3.max(tableData, x => {
            return x.Year;
        }) + 1])
        .range([padding, w - padding])

    let formatTime = d3.timeFormat('%M:%S')

    let timeArr = tableData.map(x => {
        console.log(x.Time)
        return new Date(formatTime(x.Time));
    });
    setXandYAxis();
}

let setPoint = () => {
    svg.selectAll('circle')
        .data(tableData)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', 5)
        .attr('data-xvalue', x => {
            return x.Year;
        })
        .attr('data-yvalue', x =>{
            return new Date(x.Seconds * 1000);
        })
        .attr('cx', x => {
            return xScale(x.Year)
        })
        .attr('cy', x => {
            return yScale(new Date(x.Seconds * 1000))
        })
        .attr('fill', x => {
            if (x.Doping === "") {
                return "green";
            } else {
                return "red";
            }
        })
        .on('mouseover', x => {
            tooltip.transition()
                .style('visibility', 'visible')

            if (x.Doping != "") {
                tooltip.text(x.Year + " - " + x.Name + " - " + x.Time + " - " + x.Doping)
            } else {
                tooltip.text(x.Year + " - " + x.Name + " - " + x.Time + " - " + "no Doping Allegation")
            }
            tooltip.attr('data-year', x.Year)
        })
        .on('mouseout', x => {
            tooltip.transition().style('visibility', 'hidden')
        })

}

let setXandYAxis = () => {
    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'));
    let yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat('%M:%S'));

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (h - padding) + ')')
    
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
}



getData();