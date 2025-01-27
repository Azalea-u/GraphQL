export const fetchData = async () => {
    const auth = localStorage.getItem('authToken');
    console.log(auth);
    const query = {
        query: `{
            user {
                id
                login
                firstName
                lastName
                email
                campus
                auditRatio
                totalUp
                totalDown
                xpTotal: transactions_aggregate(where: {type: {_eq: "xp"}, eventId: {_eq: 56}}) {
                  aggregate {
                    sum {
                      amount
                    }
                  }
                }
                events(where:{eventId:{_eq:56}}) {
                  level
                }
                xp: transactions(order_by: {createdAt: asc}
                  where: {type: {_eq: "xp"}, eventId: {_eq: 56}}) {
                    createdAt
                    amount
                    path
                }
                finished_projects: groups(where:{group:{status:{_eq:finished}}}) {
                    group {
                    path
                    status
                  }
                }
                current_projects: groups(where:{group:{status:{_eq:working}}}) {
                    group {
                    path
                    status
                    members {
                      userLogin
                    }
                  }
                }
                setup_project: groups(where:{group:{status:{_eq:setup}}}) {
                    group {
                    path
                    status
                    members {
                      userLogin
                    }
                  }
                }
                skills: transactions(
                    order_by: {type: asc, amount: desc}
                    distinct_on: [type]
                    where: {eventId: {_eq: 56}, _and: {type: {_like: "skill_%"}}}
                ) {
                    type
                    amount
                }
            }
        }`
    };

    try {
        const response = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyMzk0IiwiaWF0IjoxNzM3OTg4MjY2LCJpcCI6IjEwLjI0OC4wLjg4LCAxNzIuMTguMC4yIiwiZXhwIjoxNzM4MDc0NjY2LCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsidXNlciJdLCJ4LWhhc3VyYS1jYW1wdXNlcyI6Int9IiwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLXVzZXItaWQiOiIyMzk0IiwieC1oYXN1cmEtdG9rZW4taWQiOiIyNjllMjJhMi05OTRmLTQ3YzgtYjhkNy0xZmE5YWZlNzMwZjEifX0.CCWDUw-3kiFRbCHopbJ84xEi-vADqEqiNSuFmqRxEUU`,
            },
            body: JSON.stringify(query),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export default fetchData;
