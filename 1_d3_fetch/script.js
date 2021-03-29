const tempData = [],
    timeData = [],
    lat = '40.714272',
	lon = '-74.005966',
    unit = 'imperial',
    key = '98030b0214d647fb76764fd4e981ebfa',
    url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${unit}&appid=${key}`;

const svg = d3.select('#viz')
    .append('svg')
    .attr('height', '300')
    .attr('width', '1000')
    .attr('height', '300');

const margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

let formatTime = d3.timeFormat("%A %m/%d");

d3.json(url).then(function (data) {
    for (var i = 0; i<data.daily.length; i++) {
        tempData.push(data.daily[i].temp.day);
        timeData.push(formatTime(new Date(data.daily[i].dt * 1000)));
    }  

    console.log(timeData);
    console.log(tempData);
    const tooltip = d3.select('body')
        .append('div')
        .style('position', 'absolute')
        .style('top', '0px')
        .style('background', '#FFFFFF');
        
    const colors = d3.scaleLinear()
        .domain([d3.min(tempData), d3.max(tempData)])
        .range(['#424ef5', '#f54242']);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(tempData)])
        .range([0, height]);

    const yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(tempData)])
        .range([height, 0]);

    const yAxisMap = d3.axisLeft(yAxisScale);

    const xScale = d3.scaleBand()
        .domain(tempData)
        .padding(0.1)
        .range([0, width]);

    const xAxisValues = d3.scaleBand()
        .domain(timeData)
        .padding(0.1)
        .range([0, width]);

    const xAxisTicks = d3.axisBottom(xAxisValues);

    const viz = svg.append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll('rect')
        .data(tempData)
        .enter().append('rect')
        .attr('height', 0)
        .attr('width', xScale.bandwidth())
        .attr('x', function(d, i) { return xScale(d); })
        .attr('y', function(d, i) { return height; } )
        .attr('fill', function(d) { return colors(d); })

        //working tooltip
        .on('mouseover', function(e, d){
            tooltip.html(`${d.temp}&deg;`)
                .style('top', `${event.layerY}px`)
                .style('left', `${event.layerX}px`)
            d3.select(this)
                .style('opacity', '0.5')
        })
        
        .on('mouseout', function(d) {
            tooltip.html('')
            d3.select(this)
                .style('opacity', '1')
        });

    const yCall = d3.select('#viz svg').append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(yAxisMap);

    const xCall = d3.select('#viz svg').append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(xAxisTicks);

    viz.transition()
            .delay(400)
            .attr('height', function(d) { return yScale(d); })
            .attr('y', function(d) { return height - yScale(d); });
});