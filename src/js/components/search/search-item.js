import React, {Component} from 'react';
import {BrowserRouter, Route, Link} from 'react-router-dom';

class SearchItem extends Component {
	render() {
		var noReviewsPanel = this.props.hasReviews 
													? undefined 
													: <div className="col-xs-12">
			                        <div className="panel panel-warning">
		                            <div className="panel-heading">No reviews found.</div>
			                        </div>
			                      </div>;

		var diffs = this.props.diffRating;
		diffs = typeof(diffs) === 'string' ? diffs : diffs.toFixed(1);	                      
		
    return (
			<div className='search-result card row'>
        <div className='col-sm-3 col-md-2'>
        	<h2>
            <Link to='/course'>
              {this.props.course_id}
            </Link>
          </h2>
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
          <h3>
            <Link to='/course'>
              {this.props.title}
            </Link>
          </h3>
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
              {this.props.description || <i>No description.</i>}
            </div>
          </div>
        </div>
      </div>
		)
	}
}

export default SearchItem;