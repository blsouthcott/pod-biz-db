import React, { useEffect, useState } from 'react';
import { loadAllEntityData } from '../../../store/actions/entitiesActions';
import { useDispatch, useSelector } from 'react-redux';

export default function HomePage () {
    const dispatch = useDispatch();
    // dispatch(loadAllEntityData());

    const initialDataLoaded = useSelector(state => state.entityData.initialDataLoaded);

    useEffect(() => {
        console.log('Running useEffect on Home Page...')
        console.log('initialDataLoaded: ', initialDataLoaded)
        if (!initialDataLoaded) {
            dispatch(loadAllEntityData());
        }
    }, []);

    return (
        <div>
            <div className='overview'>
                <h2>Overview</h2>
                <p>
                    Podcast Network The Code Giant produces and releases new episodes for 50 different live shows. 
                    They employ more than 100 hosts and 200 producers. 
                    They attract and retain an average of 250,000 subscribers through a subscription model which allows listeners to subscribe and listen to a limited number of shows ad-free. 
                    A database driven website allows the network to keep track of which Subscribers are subscribed to which Shows, and Streams stores how many times Episodes are streamed and by which Subscribers. 
                    Maintaining a database driven website will allow The Code Giant to gather business intelligence insights that will drive marketing, advertising, and financial decisions around which shows will be renewed based on the subscriber and streaming counts.
                </p>
            </div>
            <div className='entity-summaries'>
                <h2>Database Outline</h2>
                <p>
                    <strong>Shows: </strong>Records the details of shows produced by the network.
                </p>
                <p>
                    <strong>Hosts: </strong>Records the details of a person who hosts one or more shows for the network.
                </p>
                <p>
                    <strong>Subscribers: </strong>Records the detail of a person who subscribes to the network.
                </p>
                <p>
                    <strong>Episodes: </strong>Records the details of an Episode recorded by a Show’s hosts and producer.
                </p>
                <p>
                    <strong>Producers: </strong>Records the details of a person who produces a show for the network. Each Producer can be assigned to one Show, while Shows can have multiple Producers.
                </p>
                <p>
                    <strong>Streams: </strong>Records the details of the stream transactions between a subscriber and episode. If the person streaming the episode is not subscribed to the network, subscriber_ID is set to NULL.
                </p>
            </div>
        </div>
    )
}
