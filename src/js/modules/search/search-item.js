var React = require('react');

var SearchItem = React.createClass({
	render: function() {
		var noReviewsPanel = this.props.hasReviews 
								? undefined 
								: <div className="col-xs-12">
			                        <div className="panel panel-warning">
			                            <div className="panel-heading">No reviews found.</div>
			                        </div>
			                      </div>

		var diffs = this.props.diffRating;
		diffs = typeof(diffs) === 'string' ? diffs : diffs.toFixed(1);	                      
		
        return (
			<div className='search-result row'>
	            <div className='col-sm-3 col-md-2'>
	            	<h2><a href={this.props.link}>{this.props.course_id}</a></h2>
	                <div className='rating col-xs-6'>
	                    <span className='large'>{this.props.diffRating}</span><br/>
	                    Avg. Difficulty
	                </div>
	                <div className='rating col-xs-6'>
	                    <span className='large'>{this.props.intRating}</span><br/>
	                    Avg. Interest
	                </div>
	                {noReviewsPanel}
	            </div>
	            <div className='col-sm-9 col-md-10'>
	                <h3><a href={this.props.link}>{this.props.title}</a></h3>
	                <div className='info row'>
	                    <div className='col-sm-4'>
	                        <strong>Last offered: </strong><span className='semester'>{this.props.lastOffered}</span>
	                    </div>
	                    <div className='col-sm-4'>
	                        <strong>Gen Ed: </strong><span className='gen_ed'>{this.props.gen_ed}</span>
	                    </div>
	                    <div className='col-sm-4'>
	                        <strong>Credits: </strong><span className='credits'>{this.props.credits}</span>
	                    </div>
	                    <div className='clearfix visible-sm'></div>
	                </div>
	                <div className='description row'>
	                    <div className='col-sm-12'>
	                        {this.props.description}
	                    </div>
	                </div>
	            </div>
	        </div>
		)
	}
})

module.exports = SearchItem;