import { fetchData } from "../datacolection.js";
import { renderXPChart } from "../components/xpChart.js";
import { renderRadarChart } from "../components/skillsChart.js";

export class ProfilePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = this.loadingTemplate();
  }

  async connectedCallback() {
    try {
      const data = await fetchData();
      console.log("Fetched User Data:", data);

      if (data?.data?.user?.length > 0) {
        this.renderProfile(data.data.user[0]);
      } else {
        this.renderError("Failed to load user data.");
      }
    } catch (error) {
      console.error("Error in connectedCallback:", error);
      this.renderError("An error occurred while fetching data.");
    }
  }

  loadingTemplate() {
    return `
      <style>
        :host {
          --C: #5bf870;
          --Bg: #05321e;
          --Ts: #5bf870a4;
          display: block;
          font-family: 'VT323', Helvetica, sans-serif;
          color: var(--C);
        }
        .loading {
          background: var(--Bg);
          padding: 20px;
          font-size: 1.5em;
          text-shadow: 0 0 5px var(--Ts);
        }
      </style>
      <div class="loading">Loading profile...</div>
    `;
  }

  renderProfile(user) {
    const xpChart = renderXPChart(user.xp);
    const radarChart = renderRadarChart(user.skills);
    const auditRatio = user.auditRatio ? user.auditRatio.toFixed(2) : "N/A";

    const renderProjects = (projects) =>
      projects.length > 0
        ? projects.map(proj => `<li> ${proj.group.path.split("/oujda")[1]} (${proj.group.status})</li>`).join("")
        : `<li class="no-projects">No projects available</li>`;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --C: #5bf870;
          --Bg: #05321e;
          --Ts: #5bf870a4;
          display: block;
          font-family: 'VT323', Helvetica, sans-serif;
          color: var(--C);
        }
        .profile {
          background: var(--Bg);
          padding: 20px;
          border: 1px solid var(--C);
          text-shadow: 0 0 5px var(--Ts);
          height: calc(100vh - 128px);
          overflow-y: auto;
        }
        /* Scrollbar Styling */
        ::-webkit-scrollbar,
        form textarea::-webkit-scrollbar {
          width: 18px;
          height: 18px;
        }
        ::-webkit-scrollbar-track,
        form textarea::-webkit-scrollbar-track {
          background-color: rgba(0, 128, 0, 0.2);
        }
        ::-webkit-scrollbar-thumb,
        form textarea::-webkit-scrollbar-thumb {
          background-color: rgba(0, 255, 0, 1);
        }
        ::-webkit-scrollbar-thumb:hover,
        form textarea::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 255, 0, 0.8);
        }
        ::-webkit-scrollbar-corner,
        form textarea::-webkit-scrollbar-corner {
          background-color: transparent;
        }
        ::selection {
          background-color: rgba(0, 255, 0, 0.2);
          color: var(--Bg);
          text-shadow: none;
        }
        .info {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .info p {
          margin: 5px 0;
        }
        .stats {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }
        .card {
          background: rgba(0, 255, 0, 0.1);
          padding: 10px;
          border-radius: 4px;
          border: 1px solid var(--C);
          min-width: 120px;
        }
        .projects {
          margin-top: 20px;
        }
        .projects h3 {
          margin-bottom: 5px;
        }
        .projects ul {
          padding-left: 20px;
          list-style: none;
        }
        .projects li {
          padding: 3px 0;
        }
        .projects li::before {
          content: " ├──";
          margin-right: 5px;
        }
        .projects li:last-child::before {
          content: " └──";
          margin-right: 5px;
        }
        .projects .no-projects::before {
          content: "" !important;
        }
        .charts {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 20px;
        }
        .chart {
          min-width: 350px;
        }
      </style>

      <div class="profile">
        <h1>${user.firstName} ${user.lastName}</h1>

        <div class="info">
          <p><strong>Login:</strong> ${user.login}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Campus:</strong> ${user.campus}</p>
        </div>

        <div class="stats">
          <div class="card"><strong>Audit Ratio:</strong> ${auditRatio}</div>
          <div class="card"><strong>Total Up:</strong> ${user.totalUp}</div>
          <div class="card"><strong>Total Down:</strong> ${user.totalDown}</div>
        </div>

        <div class="projects">
          <h2>Projects</h2>
          <h3>Finished Projects</h3>
          <ul>${renderProjects(user.finished_projects)}</ul>

          <h3>Current Projects</h3>
          <ul>${renderProjects(user.current_projects)}</ul>

          <h3>Setup Projects</h3>
          <ul>${renderProjects(user.setup_project)}</ul>
        </div>

        <div class="charts">
          <div class="chart">
            <h3>XP Progression</h3>
            ${xpChart}
          </div>
          <div class="chart">
            <h3>Skills Overview</h3>
            ${radarChart}
          </div>
        </div>
      </div>
    `;
  }

  renderError(message) {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --C: #5bf870;
          --Bg: #05321e;
          display: block;
          font-family: 'VT323', Helvetica, sans-serif;
          color: var(--C);
          padding: 20px;
        }
        .error {
          text-shadow: 0 0 5px var(--Ts, #5bf870a4);
        }
      </style>
      <div class="error">${message}</div>
    `;
  }
}
