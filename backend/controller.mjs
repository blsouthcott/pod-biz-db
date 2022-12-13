
import express, { json } from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

import { db } from './db_connector.mjs';
import * as episodesQueries from './episodesQueries.mjs';
import * as hostsQueries from './hostsQueries.mjs';
import * as producersQueries from './producersQueries.mjs';
import * as showsQueries from './showsQueries.mjs';
import * as streamsQueries from './streamsQueries.mjs';
import * as subscribersQueries from './subscribersQueries.mjs';


const app = express();
const PORT = '9381';

dotenv.config();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


function combineShowIDs(results, id) {
    // id should be host_ID or subscriber_ID
    const resultsData = [results[0]];
    for (let i=1; i<results.length; i++) {
        // our query returns a row for each show a host or subscriber is associated with, 
        // so here we take the show ID from each row and combine it into a single object 
        // which is returned to the UI to display in a single row in the table
        console.log(results[i][id], resultsData[resultsData.length-1][id]);
        if (results[i][id] === resultsData[resultsData.length-1][id]) {
            console.log('adding multiple shows');
            if (typeof(resultsData[resultsData.length-1]['show_ID']) !== 'object') {
                resultsData[resultsData.length-1]['show_ID'] = [resultsData[resultsData.length-1]['show_ID']];
            };
            resultsData[resultsData.length-1]['show_ID'].push(results[i]['show_ID']);
        } else {
            resultsData.push(results[i]);
        };
    };
    return resultsData;
};

function formatDates(results) {
    for (let i=0; i<results.length; i++) {
        results[i].date_released = new Date(results[i].date_released).toLocaleDateString();
        results[i].time_streamed = `${new Date(results[i].time_streamed).toLocaleDateString()} ${new Date(results[i].time_streamed).toLocaleTimeString()}`;
    }
    return results;
}


// ***********************
// Producers routes
// ***********************
app.get('/producers', (req, res) => {
    const selectAllProducers = producersQueries.selectAll();
    console.log(selectAllProducers);
    db.query(selectAllProducers, (err, results, fields) => {
        if (err) {
            console.log('error exectuing query: ' + err);
            res.status(500).send(JSON.stringify(err));
        };
        res.status(200).send(JSON.stringify(results));
    })
});


app.post('/producers', (req, res) => {
        // Define our queries
        const addNewProducer = producersQueries.addNewProducer();
        const inputs = [
            req.body.newProducerFirstName, 
            req.body.newProducerLastName,
            req.body.newProducerShowID, 
            req.body.newProducerEmail, 
            req.body.newProducerPhone
        ]
        console.log('query: ', addNewProducer);
        console.log('inputs: ', inputs);
        db.query(addNewProducer, inputs, (err, results, fields) => {
            if (err) {
                console.log('error exectuing query: ' + err);
                res.status(500).send(JSON.stringify(err));
            };
            res.status(201).send(JSON.stringify(results));
        });
});


app.put('/producers', (req, res) => {
        const updateProducer = producersQueries.updateProducer();
        const inputs = [
            req.body.producerToUpdateFirstName, 
            req.body.producerToUpdateLastName,
            req.body.producerToUpdateShowID, 
            req.body.producerToUpdateEmail, 
            req.body.producerToUpdatePhone,
            req.body.producerToUpdateID
        ]
        
        console.log('query: ', updateProducer);
        console.log('inputs: ', inputs);

        db.query(updateProducer, inputs, (err, results, fields) => {
            if (err) {
                console.log('error exectuing query: ' + err);
                res.status(500).send(JSON.stringify(err));
            };
            res.status(200).send(JSON.stringify(results));
        });
});


app.delete('/producers/:id', (req, res) => {
    const deleteProducer = producersQueries.deleteProducer();
    db.query(deleteProducer, [req.params.id], (err, results, fields) => {
        if (err) {
            console.log('error exectuing query: ' + err);
            res.status(500).send(JSON.stringify(err));
        };
        res.status(200).send(JSON.stringify(results));
    });
});


// ***********************
// Episodes routes
// ***********************
app.get('/episodes', (req, res) => {
    let episodeQuery;
    console.log('request query: ' + JSON.stringify(req.query));
    let inputs;
    if (req.query.episodeTitle !== undefined || req.query.hostName !== undefined) {
        episodeQuery = episodesQueries.searchEpisode({ episodeTitle: req.query.episodeTitle, hostName: req.query.hostName });
        inputs = req.query.EpisodeTitle !== undefined && req.query.hostName !== undefined ? [`%${req.query.episodeTitle}%`, `%${req.query.hostName}%`] : req.query.episodeTitle !== undefined ? [`%${req.query.episodeTitle}%`] : [`%${req.query.hostName}%`];
    } else {
        episodeQuery = episodesQueries.selectAll();
        inputs = []
    };
    console.log('query: ', episodeQuery);
    console.log('inputs: ', inputs);
    db.query(episodeQuery, inputs, (err, results, fields) => {
        if (err) {
            console.log('error exectuing query: ' + err);
            res.status(500).send(JSON.stringify(err));
        };
        results = formatDates(results);
        res.status(200).send(JSON.stringify(results));
    });
});


app.post('/episodes', (req, res) => {
    console.log('request body: ', req.body);
    const getNumHosts = episodesQueries.getNumHostsForShow()
    let inputs = [parseInt(req.body.newEpisodeShowID)]
    console.log('query: ', getNumHosts);
    console.log('inputs: ', inputs);
    db.query(getNumHosts, inputs, (err, results, fields) => {
        if (err) {
            console.log('error exectuing query: ' + err);
            res.status(500).send(JSON.stringify(err));
            return;
        };
        if (results[0].num_hosts < 1) {
            console.log(`0 hosts for show ${req.body.newEpisodeShowID}, returning 400 status code....`);
            res.status(400).send(`no hosts are assigned to show with show ID: ${req.body.newEpisodeShowID}`);
            return;
        };
        const addNewEpisode = episodesQueries.addNewEpisode();
        inputs = [
            parseInt(req.body.newEpisodeShowID),
            req.body.newEpisodeTitle,
            req.body.newEpisodeSummary,
            req.body.newEpisodeDateReleased,
            parseInt(req.body.newEpisodeShowID)
        ]
        console.log('request body: ' + JSON.stringify(req.body));
        console.log('query: ', addNewEpisode);
        console.log('inputs: ', inputs);
        db.query(addNewEpisode, inputs, (err, results, fields) => {
            if (err) {
                console.log('error exectuing query: ' + err);
                res.status(500).send(JSON.stringify(err));
            };
            res.status(201).send(JSON.stringify(results));
        });
    });
});
    


app.put('/episodes', (req, res) => {
    const updateEpisode = episodesQueries.updateEpisode();
    const inputs = [
        req.body.episodeToUpdateTitle,
        req.body.episodeToUpdateSummary,
        req.body.episodeToUpdateDateReleased,
        parseInt(req.body.episodeToUpdateID)
    ]
    console.log('query: ', updateEpisode);
    console.log('inputs: ', inputs);
    db.query(updateEpisode, inputs, (err, results, fields) => {
        if (err) {
            console.log('error exectuing query: ' + err);
            res.status(500).send(JSON.stringify(err));
        };
        res.status(200).send(JSON.stringify(results));
    });
});


app.delete('/episodes/:id', (req, res) => {
    const deleteEpisode = episodesQueries.deleteEpisode();
    const inputs = [parseInt(req.params.id)];
    console.log('query: ', deleteEpisode);
    console.log('inputs: ', inputs);
    db.query(deleteEpisode, inputs, (err, results, fields) => {
        if (err) {
            console.log('error exectuing query: ' + err);
            res.status(500).send(JSON.stringify(err));
        };
        res.status(200).send(JSON.stringify(results));
    });
});


// ***********************
// Hosts routes
// ***********************
app.get('/hosts', (req, res) => {
    const selectAllHosts = hostsQueries.selectAll();
    console.log('query: ', selectAllHosts);
    db.query(selectAllHosts, (err, results, fields) => {
        if (err) {
            console.log('error exectuing query: ' + err);
            res.status(500).send(JSON.stringify(err));
        };
        results = combineShowIDs(results, 'host_ID');
        res.status(200).send(JSON.stringify(results));
    });
});


app.post('/hosts', (req, res) => {
    console.log('request body: ', req.body);
    const addNewHost = hostsQueries.addNewHost();
    let inputs;
    inputs = [
        req.body.newHostFirstName,
        req.body.newHostLastName,
        req.body.newHostEmail,
        req.body.newHostPhone
    ]
    console.log('query: ', addNewHost);
    console.log('inputs: ', inputs);
    db.query(addNewHost, inputs, (err, results, fields) => {
        if (err) {
            console.log('error exectuing query: ' + err);
            res.status(500).send(JSON.stringify(err));
            return;
        };
        if (req.body.newHostShowIDs.length === 0) {
            res.status(201).send('success');
            return;
        };
        const hostID = results['insertId'];
        console.log('new host ID: ', hostID);
        const addShow = hostsQueries.addNewInterShowsHosts();
        for (let i=0; i<req.body.newHostShowIDs.length; i++) {
            inputs = [
                hostID,
                parseInt(req.body.newHostShowIDs[i])
            ]
            console.log('query: ', addShow);
            console.log('inputs: ', inputs);
            db.query(addShow, inputs, (err, results, fields) => {
                if (err) {
                    console.log('error exectuing query: ' + err);
                    res.status(500).send(JSON.stringify(err));
                };
                if (i === req.body.newHostShowIDs.length-1) {
                    res.status(201).send('success');
                };
            });
        };    
    });
});


app.put('/hosts', (req, res) => {
    console.log('request body: ', req.body);
    const selectShows = hostsQueries.selectShows();
    console.log('query: ', selectShows);
    db.query(selectShows, [parseInt(req.body.hostToUpdateID)], (err, results, fields) => {
        if (err) {
            console.log('error exectuing query: ' + err);
            res.status(500).send(JSON.stringify(err));
            return;
        }
        console.log('shows query result: ', results);
        const showsToAdd = [];
        for (let updatedShowID of req.body.hostToUpdateShowIDs) {
            if (!results.find((row) => row.show_ID == updatedShowID)) {
                showsToAdd.push(updatedShowID);
            };
        };
        const addShow = hostsQueries.addNewInterShowsHosts();
        const showsToDelete = [];
        for (let row of results) {
            if (!req.body.hostToUpdateShowIDs.find((updatedShowID) => updatedShowID == row.show_ID)) {
                showsToDelete.push(row.show_ID);
            };
        };
        const deleteShow = hostsQueries.deleteInterShowsHosts();
        const queries = [];
        for (let i=0; i<showsToAdd.length; i++) {
            queries.push([addShow, [parseInt(req.body.hostToUpdateID), showsToAdd[i]]]);
        };
        for (let i=0; i<showsToDelete.length; i++) {
            queries.push([deleteShow, [parseInt(req.body.hostToUpdateID), showsToDelete[i]]]);
        };
        const updateHost = hostsQueries.updateHost();
        queries.push([
            updateHost, 
            [
                req.body.hostToUpdateFirstName,
                req.body.hostToUpdateLastName,
                req.body.hostToUpdateEmail,
                req.body.hostToUpdatePhone,
                parseInt(req.body.hostToUpdateID)
            ]
        ]);
        for (let i=0; i<queries.length; i++) {
            console.log('query: ', queries[i][0]);
            console.log('inputs: ', queries[i][1]);
            db.query(queries[i][0], queries[i][1], (err, results, fields) => {
                if (err) {
                    console.log('error exectuing query: ' + err);
                    res.status(500).send(JSON.stringify(err));
                    return;
                };
                if (i === queries.length-1) {
                    res.status(200).send('success');
                };
            })
        };
    });
});


// ***********************
// Shows routes
// ***********************
app.get('/shows', (req, res) => {
    const selectAllShows = showsQueries.selectAll();
    console.log(selectAllShows);
    db.query(selectAllShows, (err, results, fields) => {
        if (err) {
            console.log('error exectuing query: ' + err);
            res.status(500).send(JSON.stringify(err));
        }
        res.status(200).send(JSON.stringify(results))
    });
});


app.post('/shows', (req, res) => {
    console.log(req.body);
    const addNewShow = showsQueries.addNewShow();
    console.log(addNewShow);
    db.query(addNewShow, [req.body.newShowTitle], (err, results, fields) => {
        if (err) {
            console.log('error exectuing query: ' + err);
            res.status(500).send(JSON.stringify(err));
        }
        res.status(201).send(JSON.stringify(results));
    });
});


app.delete('/shows/:id', (req, res) => {
    const deleteShow = showsQueries.deleteShow();
    console.log(deleteShow);
    db.query(deleteShow, [req.params.id], (err, results, fields) => {
        if (err) {
            console.log('error exectuing query: ' + err);
            res.status(500).send(JSON.stringify(err));
        }
        res.status(200).send(JSON.stringify(results));
    });
});


// ***********************
// Streams routes
// ***********************
app.get('/streams', (req, res) => {
    const selectAllStreams = streamsQueries.selectAll();
    console.log('query: ', selectAllStreams);
    db.query(selectAllStreams, (err, results, fields) => {
        if (err) {
            console.log('error exectuing query: ' + err);
            res.status(500).send(JSON.stringify(err));
        }
        results = formatDates(results);
        res.status(200).send(JSON.stringify(results));
    });
});

app.post('/streams', (req, res) => {
    // Define our queries
    const addStream = streamsQueries.addNewStream(req.body.newStreamSubscriberID, req.body.newStreamEpisodeID, req.body.newStreamTimeStreamed)
    //Insert new stream into streams table
    console.log(addStream)
    db.query(addStream, (err, results, fields) => {
        if (err) {
            res.status(500).send(JSON.stringify(err))
        }
        res.status(201).send(JSON.stringify(results));
    });
});

app.delete('/streams/:id', (req, res) => {
    const deleteAStream = streamsQueries.deleteStream(req.params.id);
    db.query(deleteAStream, (err, results, fields) => {
        if (err) {
            res.status(500).send(JSON.stringify(err));
        }
        res.status(200).send(JSON.stringify(results));
    });
})

// ***********************
// Subscribers routes
// ***********************

app.get('/subscribers', (req, res) => {
    let subscribersQuery;
    let inputs;
    if (req.query.firstName !== undefined || req.query.lastName !== undefined) {
        subscribersQuery = subscribersQueries.selectAllSearch({firstName: req.query.firstName, lastName: req.query.lastName});
        inputs = req.query.firstName !== undefined && req.query.lastName !== undefined ? [`%${req.query.firstName}%`, `%${req.query.lastName}%`] : req.query.firstName !== undefined ? [`%${req.query.firstName}%`] : [`%${req.query.lastName}%`]
    } else {
        subscribersQuery = subscribersQueries.selectAll();
        inputs = []
    };
    console.log('query: ', subscribersQuery);
    console.log('inputs: ', inputs);
    db.query(subscribersQuery, inputs, (err, results, fields) => {
        if (err) {
            console.log('error exectuing query: ' + err);
            res.status(500).send(JSON.stringify(err));
        };
        results = combineShowIDs(results, 'subscriber_ID');
        console.log('results of query: ', results);
        res.status(200).send(JSON.stringify(results));
    });
});


//add new subscriber
app.post('/subscribers', (req, res) => {
    console.log('request body: ', req.body);
    let inputs;
    const addNewSubscriber = subscribersQueries.addNewSubscriber();
    inputs = [
        req.body.newSubscriberFirstName,
        req.body.newSubscriberLastName,
        req.body.newSubscriberEmail,
        req.body.newSubscriberPhone,
        req.body.newSubscriberAge,
        req.body.newSubscriberGender
    ]
    //Insert new subscriber into subscribers table and subscribers/shows inter table
    db.query(addNewSubscriber, inputs, (err, results, fields) => {
        console.log('results of query: ', results);
        if (err) {
            console.log(err);
            res.status(500).send(JSON.stringify(err));
            return;
        }
        if (req.body.newSubscriberShowIDs.length === 0) {
            res.status(201).send('success');
            return;
        };
        const subscriberID = results['insertId'];
        console.log('insert ID: ', subscriberID);
        const addShow = subscribersQueries.addNewInterSubscribersShows();
        for (let i=0; i<req.body.newSubscriberShowIDs.length; i++) {
            inputs = [
                subscriberID,
                parseInt(req.body.newSubscriberShowIDs[i])
            ]
            console.log('query: ', addShow);
            console.log('inputs: ', inputs);
            db.query(addShow, inputs, (err, results, fields) => {
                if (err) {
                    console.log('error exectuing query: ' + err);
                    res.status(500).send(JSON.stringify(err));
                    return;
                }
                if (i === req.body.newSubscriberShowIDs.length-1) {
                    res.status(201).send('success');
                };
            });
        };
    });
});

// update existing subscriber in the Subscribers and subscribers/shows inter tables

app.put('/subscribers', (req, res) => {
    // Define our queries
    console.log(req.body)
    const selectShows = subscribersQueries.selectShows();
    db.query(selectShows, [parseInt(req.body.subscriberToUpdateID)], (err, results, fields) => {
        if (err) {
            console.log('error exectuing query: ' + err);
            res.status(500).send(JSON.stringify(err));
            return;
        }
        console.log('shows query result: ', results);
        const showsToAdd = [];
        for (let updatedShowID of req.body.subscriberToUpdateSubscribedShowIDs) {
            if (!results.find((row) => row.show_ID == updatedShowID)) {
                showsToAdd.push(updatedShowID);
            };
        };
        const addShow = subscribersQueries.addNewInterSubscribersShows();
        const showsToDelete = [];
        for (let row of results) {
            if (!req.body.subscriberToUpdateSubscribedShowIDs.find((updatedShowID) => updatedShowID == row.show_ID)) {
                showsToDelete.push(row.show_ID);
            };
        };
        const deleteShow = subscribersQueries.deleteInterSubscribersShows();
        const queries = [];
        for (let i=0; i<showsToAdd.length; i++) {
            queries.push([addShow, [parseInt(req.body.subscriberToUpdateID), showsToAdd[i]]]);
        };
        for (let i=0; i<showsToDelete.length; i++) {
            queries.push([deleteShow, [parseInt(req.body.subscriberToUpdateID), showsToDelete[i]]]);
        };
        const updateSubscriber = subscribersQueries.updateSubscriber();
        queries.push([
            updateSubscriber,
            [
                req.body.subscriberToUpdateFirstName,
                req.body.subscriberToUpdateLastName,
                req.body.subscriberToUpdateEmail,
                req.body.subscriberToUpdatePhone,
                req.body.subscriberToUpdateAge,
                req.body.subscriberToUpdateGender,
                parseInt(req.body.subscriberToUpdateID)
            ]
        ]);
        for (let i=0; i<queries.length; i++) {
            console.log('query: ', queries[i][0]);
            console.log('inputs: ', queries[i][1]);
            db.query(queries[i][0], queries[i][1], (err, results, fields) => {
                if (err) {
                    console.log('error exectuing query: ' + err);
                    res.status(500).send(JSON.stringify(err));
                    return;
                };
                if (i === queries.length-1) {
                    res.status(200).send('success');
                };
            })
        };
    });
});


app.delete('/subscribers/:id', (req, res) => {
    // Define our queries
    const deleteSubscriber = subscribersQueries.deleteSubscriber();
    db.query(deleteSubscriber, [req.params.id], (err, results, fields) => {
    // Send the results to the browser
        if (err) {
            res.status(500).send(JSON.stringify(err));
        }
        res.status(200).send(JSON.stringify(results));
        });
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
