import fetchData from "../datacolection.js";

export class ProfilePage extends HTMLElement {    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        try {
            const data = await fetchData();
            if (data && data.data && data.data.user) {
                const user = data.data.user[0];
                this.renderProfile(user);
            } else {
                this.renderError("Failed to load user data.");
            }
        } catch (error) {
            this.renderError("An error occurred while fetching data.");
        }
    }

    renderProfile(user) {
        this.shadowRoot.innerHTML = `
            <style>
                .profile {
                    background: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    font-family: Arial, sans-serif;
                    color: #333;
                }
                h1, h2, h3 {
                    color: #333;
                }
                ul {
                    list-style: none;
                    padding: 0;
                }
                ul li {
                    margin: 5px 0;
                }
            </style>
            div class="logout">
                <button class="logout-button">Logout</button>
            </div>
            <div class="profile">
                <h1>${user.firstName} ${user.lastName}</h1>
                <p><strong>Login:</strong> ${user.login}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Campus:</strong> ${user.campus}</p>
                <p><strong>Audit Ratio:</strong> ${user.auditRatio}</p>
                <p><strong>Total Up:</strong> ${user.totalUp}</p>
                <p><strong>Total Down:</strong> ${user.totalDown}</p>
                <h2>XP Statistics</h2>
                <ul>
                    <li><strong>Total XP:</strong> ${user.xpTotal.aggregate.sum.amount || 0}</li>
                    ${user.xp.map(xp => `
                        <li><strong>${xp.createdAt}:</strong> ${xp.amount} XP</li>
                    `).join("")}
                </ul>
                <h2>Projects</h2>
                <h3>Finished Projects</h3>
                <ul>
                    ${user.finished_projects.map(proj => `
                        <li>${proj.group.path} (${proj.group.status})</li>
                    `).join("")}
                </ul>
                <h3>Current Projects</h3>
                <ul>
                    ${user.current_projects.map(proj => `
                        <li>${proj.group.path} (${proj.group.status})</li>
                    `).join("")}
                </ul>
                <h3>Setup Projects</h3>
                <ul>
                    ${user.setup_project.map(proj => `
                        <li>${proj.group.path} (${proj.group.status})</li>
                    `).join("")}
                </ul>
                <h2>Skills</h2>
                <ul>
                    ${user.skills.map(skill => `
                        <li>${skill.type}: ${skill.amount}</li>
                    `).join("")}
                </ul>
            </div>
        `;
    }

    renderError(message) {
        this.shadowRoot.innerHTML = `
            <style>
                .error {
                    color: red;
                    font-family: Arial, sans-serif;
                }
            </style>
            <div class="error">${message}</div>
        `;
    }
}
