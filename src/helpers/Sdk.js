export default class Sdk {
  constructor({ token, baseUrl = "https://api.github.com" }) {
    this.token = token
    this.baseUrl = baseUrl
  }

  setToken = token => {
    this.token = token
  }

  fetch = async(path, options = {}) => {

    if (!options.headers) {
      options.headers = {}
    }

    options.headers.Authorization = `token ${this.token}`

    const res = await fetch(path, options)
    if (!res.ok) {
      throw new Error(await res.json())
    }

    return res.json()
  }

  listOrganizations() {
    return this.fetch(`${this.baseUrl}/user/orgs`)
  }

  async listTeams(orgs) {
    const data = await this.fetch(`${this.baseUrl}/orgs/${orgs}/teams`)
    return Promise.all(
      data.map(async team => {
        team.repositories = await this.fetch(team.repositories_url)
        team.repositories = await Promise.all(team.repositories.map(async repo => {
          repo.milestones = await this.fetch(`${this.baseUrl}/repos/${orgs}/${repo.name}/milestones`)
          repo.milestones = await Promise.all(repo.milestones.map(async milestone => {
            milestone.issues = await this.fetch(`${this.baseUrl}/repos/${orgs}/${repo.name}/issues?milestone=${milestone.number}&state=all`)
            return milestone
          }))
          return repo
        }))
        return team
      })
    )
  }
}