export const fetchData = async () => {
    const auth = localStorage.getItem('authToken');
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
                Authorization: `Bearer ${auth}`,
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
