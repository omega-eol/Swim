var directives = {};

// Bar plot
directives.swimGraph = function() {
    
    function link(scope, element) {
        
    	// variables
    	var initialize = false;
    	var margin = {top: 20, right: 20, bottom: 30, left: 40};
    	var width = null, height = null;
    	var svg = null, x = null, y = null, xAxis = null, yAxis = null;
    	
        // initialization function
        scope.init = function() {
            
        	//Set width, and height
            width = scope.width - margin.left - margin.right,
            height = scope.height - margin.top - margin.bottom;
          
            //Create the d3 element and position it based on margins
            svg = d3.select(element[0])
              .append("svg")
              .attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
            //Create the scales we need for the graph
            x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
            y = d3.scale.linear().range([height, 0]);
 
            //Create the axes we need for the graph
            xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");
 
            yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(10);
            
            initialize = true;
        };
        
        // render plot function
        scope.render = function(data) {
        	// make sure plot is initialized
        	if (!initialize) scope.init();
        	
			//Set our scale's domains
			x.domain(data.map(function(d) { return d.name; }));
			y.domain([0, d3.max(data, function(d) { return d.count; })]);
			  
			//Remove the axes so we can draw updated ones
			svg.selectAll('g.axis').remove();
			  
			//Render X axis
			svg.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + height + ")")
			  .call(xAxis);
			  
			//Render Y axis
			svg.append("g")
			  .attr("class", "y axis")
			  .call(yAxis)
			  .append("text")
			  .attr("transform", "rotate(-90)")
			  .attr("y", 6)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .text(scope.ylabel);
			  
			//Create or update the bar data
			var bars = svg.selectAll(".bar").data(data);
			bars
			  .enter()
			  .append("rect")
			  .attr("class", "bar")
			  .attr("x", function(d) { return x(d.name); })
			  .attr("width", x.rangeBand())
			  .attr("fill", function(d) { return d.color });
			 
			//Animate bars
			bars
			  .transition()
			  //.duration(1000)
			  .attr('height', function(d) { return height - y(d.count); })
              .attr("y", function(d) { return y(d.count); })
        };
        
        //Watch 'data' and run scope.render(newVal) whenever it changes
        //Use true for 'objectEquality' property so comparisons are done on equality and not reference
        scope.$watch('data', function(){
            if (scope.data) scope.render(scope.data);
        }, true);
        
    };
    
    return {
        restrict: 'E',
        scope: {
            data: '=',
            width: '=',
            height: '=',
            ylabel: '='
        },
        link: link
    };
};

//Attach controllers to the App
swimApp.directive(directives);
