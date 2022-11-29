const core = require('@actions/core');
const github = require('@actions/github');

// most @actions toolkit packages have async methods
async function run() {
  try {
    const myToken = core.getInput('gh_token');
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');
    const milestone_number = core.getInput('milestone_number');

    const octokit = github.getOctokit(myToken);

    console.log(`Getting milestone number ${milestone_number}`);

    const { data: milestone } = await octokit.rest.issues.getMilestone({
      owner,
      repo,
      milestone_number,
    });
    console.debug(`Milestone payload is ${JSON.stringify(milestone,undefined,2)}`);

    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.debug(`Event payload is ${payload}`)

    const issue_number = github.context.payload.issue.number;
    console.log(`Updating issue ${issue_number} with milestone ${milestone_number}`)

    const { data: issue }= await octokit.rest.issues.update({
      owner: owner,
      repo: repo,
      issue_number: issue_number,
      milestone: milestone_number
    });
    console.debug(`Updated Issue ${JSON.stringify(issue, undefined, 2)}`)

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
