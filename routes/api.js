'use strict';

let issues = [];

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;

      console.log(project, '<-name')
      const filters = req.query
      console.log(filters, '<filters')

      const projectIssues = issues.filter(issue => issue.project === project);
      if (Object.keys(filters).length === 0) {
        console.log('Keine Filter angegeben, gebe alle Issues zurück:', projectIssues);
        return res.json(projectIssues);
      }
      const filteredIssues = projectIssues.filter(issue => {
        console.log(`Checking issue: ${JSON.stringify(issue)}`);

        for (let key in filters) {
          if (filters[key] !== undefined) {
            const issueValue = issue[key]?.toString().toLowerCase();
            const filterValue = filters[key].toLowerCase();

            console.log(`Checking filter for ${key}: ${issueValue} against ${filterValue}`);
            if (issueValue !== filterValue) {
              return false;
            }
          }
        }
        return true;
      });
      console.log(issues)
      console.log('neues Problem get', filteredIssues)
      res.json(filteredIssues);
    })

    .post(function (req, res) {
      let project = req.params.project;

      const data = req.body;

      if (!data.issue_title || !data.issue_text || !data.created_by) {
        return res.json({ error: 'required field(s) missing' })
      }

      const created_on = new Date().toISOString();
      const updated_on = created_on;
      const open = true;
      const _id = require('crypto').randomBytes(12).toString('hex');

      const newIssue = {
        _id: _id,
        issue_title: data.issue_title,
        issue_text: data.issue_text,
        created_on: created_on,
        updated_on: updated_on,
        created_by: data.created_by,
        assigned_to: data.assigned_to || '',
        open: open,
        status_text: data.status_text || '',
        project: project

      }

      console.log('neues Problemff', data, '<data, title>', data.issue_title)
      console.log('Vor dem Push, aktuelles Issues-Array:', issues);
      issues.push(newIssue);
      console.log('Nach dem Push, aktuelles Issues-Array:', issues);
      res.json(newIssue)
    })

    .put(function (req, res) {
      let project = req.params.project;
      const data = req.body;

      const _id = data._id || req.query._id

      if (!_id) {
        return res.json({ error: 'missing _id' })
      }
      console.log(data, 'update fff')

      const updateFields = { ...data };
      delete updateFields._id;

      if (Object.keys(updateFields).length === 0) {
        return res.json({ error: 'no update field(s) sent', '_id': _id })
      }

      // Issue mit der angegebenen ID finden
      const issueIndex = issues.findIndex(issue => issue._id === _id && issue.project === project);
      if (issueIndex === -1) {
        return res.json({ error: 'could not update', '_id': _id });
      }

      // Aktualisiere das Issue
      const updatedIssue = {
        ...issues[issueIndex],
        ...updateFields,
        updated_on: new Date().toISOString()
      };
      issues[issueIndex] = updatedIssue;

      // Erfolgsmeldung zurückgeben
      res.json({ result: 'successfully updated', '_id': _id });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      const data = req.body;

      const _id = data._id;

      if (!_id) {
        return res.json({ error: 'missing _id' })
      }

      const issueIndex = issues.findIndex(issue => issue._id === _id && issue.project === project);
      if (issueIndex === -1) {
        return res.json({ error: 'could not delete', '_id': _id });
      }

      
      console.log('issueIndex', issueIndex)
      issues.splice(issueIndex,1)
      console.log(data, 'zum löschen')

      res.json({ result: 'successfully deleted', '_id': _id })
    });

};
