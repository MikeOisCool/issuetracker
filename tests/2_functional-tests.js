const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    test('1. Create an issue with every field: POST request to /api/issues/{project}', function (done) {
        chai.request(server)
            .post('/api/issues/my_project')
            .send({
                issue_title: 'data.issue_title',
                issue_text: 'data.issue_text',
                created_by: 'data.created_by',
                assigned_to: 'data.assigned_to',
                status_text: 'data.status_text'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, '_id');
                assert.equal(res.body.issue_title, 'data.issue_title');
                assert.equal(res.body.issue_text, 'data.issue_text');
                assert.equal(res.body.created_by, 'data.created_by');
                assert.equal(res.body.assigned_to, 'data.assigned_to');
                assert.equal(res.body.open, true);
                assert.equal(res.body.status_text, 'data.status_text');
                assert.equal(res.body.project, 'my_project');
                done();
            })
    })
    test('2. Create an issue with only required fields: POST request to /api/issues/{project}', function (done) {
        chai.request(server)
            .post('/api/issues/my_project')
            .send({
                issue_title: 'data.issue_title',
                issue_text: 'data.issue_text',
                created_by: 'data.created_by'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, '_id')
                assert.equal(res.body.issue_title, 'data.issue_title');
                assert.equal(res.body.issue_text, 'data.issue_text');
                assert.equal(res.body.open, true);
                assert.equal(res.body.project, 'my_project');
                done();
            })
    })
    test('3. Create an issue with missing required fields: POST request to /api/issues/{project}', function (done) {
        chai.request(server)
            .post('/api/issues/my_project')
            .send({
                issue_title: 'data.issue_title',
                issue_text: 'data.issue_text',

            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'required field(s) missing' })

                done();
            })
    })
    test('4. View issues on a project: GET request to /api/issues/{project}}', function (done) {
        chai.request(server)
            .get('/api/issues/my_project')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body);

                if (res.body.length > 0) {
                    const issue = res.body[0];
                    assert.property(issue, '_id');
                    assert.property(issue, 'issue_title');
                    assert.property(issue, 'issue_text');
                    assert.property(issue, 'created_by');
                    assert.property(issue, 'assigned_to');
                    assert.property(issue, 'status_text');
                    assert.property(issue, 'open');
                    assert.property(issue, 'created_on');
                    assert.property(issue, 'updated_on');

                    // Optional: Überprüfe Beispielwerte für das erste Issue
                    assert.equal(issue.project, 'my_project');
                    assert.isTrue(issue.open);
                }
                done();
            })
    })
    test('5. View issues on a project with one filter: GET request to /api/issues/{project}', function (done) {
        chai.request(server)
            .get('/api/issues/my_project')
            .query({ open: 'true' })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                res.body.forEach(issue => {
                    assert.property(issue, '_id');
                    assert.property(issue, 'issue_title');
                    assert.property(issue, 'issue_text');
                    assert.property(issue, 'created_by');
                    assert.property(issue, 'assigned_to');
                    assert.property(issue, 'status_text');
                    assert.property(issue, 'open');
                    assert.property(issue, 'created_on');
                    assert.property(issue, 'updated_on');


                    assert.isTrue(issue.open);
                });
                done();
            });
    });
    test('6. View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
        chai.request(server)
            .get('/api/issues/my_project')
            .query({ open: 'true', created_by: 'data.created_by' })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                res.body.forEach(issue => {
                    assert.property(issue, '_id');
                    assert.property(issue, 'issue_title');
                    assert.property(issue, 'issue_text');
                    assert.property(issue, 'created_by');
                    assert.property(issue, 'assigned_to');
                    assert.property(issue, 'status_text');
                    assert.property(issue, 'open');
                    assert.property(issue, 'created_on');
                    assert.property(issue, 'updated_on');


                    assert.isTrue(issue.open);
                    assert.equal(issue.created_by, 'data.created_by');
                });
                done();
            });
    });


    test('7. Update one field on an issue (with mock data): PUT request to /api/issues/{project}', function (done) {
        chai.request(server)
            .put('/api/issues/my_project')
            .send({
                _id: 'dummyId123',  // Verwende die Dummy-ID aus dem Mock-Array
                issue_text: 'Updated Text'
            })
            .end(function (err, res) {
                console.log(res.body, 'Antwortinhalt');
                assert.equal(res.status, 200);
                assert.property(res.body, 'result'); // Stelle sicher, dass die `result`-Eigenschaft vorhanden ist
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, 'dummyId123');
                done();
            });
    });
    test('8. Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
        chai.request(server)
            .put('/api/issues/my_project')
            .send({
                _id: 'dummyId123',  // Verwende die Dummy-ID aus dem Mock-Array
                issue_text: 'Updated Text',
                assigned_to: 'New Assignee'
            })
            .end(function (err, res) {
                console.log(res.body, 'Antwortinhalt');
                assert.equal(res.status, 200);
                assert.property(res.body, 'result'); // Stelle sicher, dass die `result`-Eigenschaft vorhanden ist
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, 'dummyId123');
                done();
            });
    });
    test('9. Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
        chai.request(server)
            .put('/api/issues/my_project')
            .send({
                issue_text: 'Attempt to update without _id',
                assigned_to: 'No ID',
                status_text: 'Testing missing ID'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'missing _id');
                done();
            });
    });


    test('10. Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
        chai.request(server)
            .put('/api/issues/my_project1')
            .send({
                _id: 'worng',
                // issue_text: '',
                // assigned_to: '',
                // status_text: ''
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'no update field(s) sent');
                done();
            });
    });

    test('11. Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
        chai.request(server)
            .put('/api/issues/my_project1')
            .send({
                _id: 'worng',
                // issue_text: '',
                // assigned_to: '',
                // status_text: ''
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'no update field(s) sent');
                done();
            });
    });
    test('12. Delete an issue: DELETE request to /api/issues/{project}', function (done) {
        chai.request(server)
            .delete('/api/issues/my_project')
            .send({
                _id: 'dummyId1234',
                // issue_text: '',
                // assigned_to: '',
                // status_text: ''
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'result');
                assert.equal(res.body.result, 'successfully deleted');
                assert.equal(res.body._id, 'dummyId1234');
                done();
            });
    });
    test('13. Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {
        chai.request(server)
            .delete('/api/issues/my_project')
            .send({
                _id: 'wrong',
                // issue_text: '',
                // assigned_to: '',
                // status_text: ''
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'could not delete');

                done();
            });
    });
    test('14. Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {
        chai.request(server)
            .delete('/api/issues/my_project')
            .send({
                _id: '',
                // issue_text: '',
                // assigned_to: '',
                // status_text: ''
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'missing _id');

                done();
            });
    });


});