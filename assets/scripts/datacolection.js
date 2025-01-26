export const fetchData = async () => {
    const auth = localStorage.getItem('authToken');
    if (!auth) {
        console.error('No authentication token found.');
        return null;
    }

    const query = {
        query: `
            query UserData($eventId: Int!) {
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
                    xpTotal: transactions_aggregate(where: {type: {_eq: "xp"}, eventId: {_eq: $eventId}}) {
                        aggregate {
                            sum {
                                amount
                            }
                        }
                    }
                    events(where: {eventId: {_eq: $eventId}}) {
                        level
                    }
                    xp: transactions(order_by: {createdAt: asc}, where: {type: {_eq: "xp"}, eventId: {_eq: $eventId}}) {
                        createdAt
                        amount
                        path
                    }
                    finished_projects: groups(where: {group: {status: {_eq: "finished"}}}) {
                        group {
                            path
                            status
                        }
                    }
                    current_projects: groups(where: {group: {status: {_eq: "working"}}}) {
                        group {
                            path
                            status
                            members {
                                userLogin
                            }
                        }
                    }
                    setup_project: groups(where: {group: {status: {_eq: "setup"}}}) {
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
                        where: {eventId: {_eq: $eventId}, _and: {type: {_like: "skill_%"}}}
                    ) {
                        type
                        amount
                    }
                }
            }
        `,
        variables: {
            eventId: 56,
        },
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

        const responseData = await response.json();

        // Check for errors in the response
        if (responseData.errors) {
            console.error("GraphQL Errors:", responseData.errors);
            return null;
        }

        // Check if the data structure is valid
        if (!responseData || !responseData.data || !responseData.data.user) {
            console.error('Invalid data structure:', responseData);
            return null;
        }

        return responseData.data;

    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};
