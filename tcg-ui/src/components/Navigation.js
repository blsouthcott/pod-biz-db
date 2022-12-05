import React from 'react';
import { Link } from 'react-router-dom';

function Navigation () {
    return (
        <div>
            <nav>
                <p>
                    <Link className="link" to='/'>Home </Link>
                    <Link className="link" to='/shows'>Shows </Link>
                    <Link className="link" to='/hosts'>Hosts </Link>
                    <Link className="link" to='/subscribers'>Subscribers </Link>
                    <Link className="link" to='/episodes'>Episodes </Link>
                    <Link className="link" to='/producers'>Producers </Link>
                    <Link className="link" to='/streams'>Streams</Link>
                </p>
            </nav>
        </div>
    )
}

export default Navigation;
