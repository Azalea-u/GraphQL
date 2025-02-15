export const fetchData = async () => {
  const auth = localStorage.getItem('authToken');

  const query = {
      query: `
      {
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
              xpTotal: transactions_aggregate(
                  where: { eventId: { _eq: 41 }, type: { _eq: "xp" } }
              ) {
                  aggregate {
                      sum {
                          amount
                      }
                  }
              }
              xp: transactions(
                  order_by: { createdAt: asc },
                  where: { eventId: { _eq: 41 }, type: { _eq: "xp" } }
              ) {
                  createdAt
                  amount
                  path
              }
              finished_projects: groups(
                  where: { group: { status: { _eq: finished } } }
              ) {
                  group {
                      path
                      status
                  }
              }
              current_projects: groups(
                  where: { group: { status: { _eq: working } } }
              ) {
                  group {
                      path
                      status
                      members {
                          userLogin
                      }
                  }
              }
              setup_project: groups(
                  where: { group: { status: { _eq: setup } } }
              ) {
                  group {
                      path
                      status
                      members {
                          userLogin
                      }
                  }
              }
              skills: transactions(
                  order_by: { type: asc, amount: desc },
                  distinct_on: [type],
                  where: { _and: { type: { _like: "skill_%" } } }
              ) {
                  type
                  amount
              }
          }
      }
      `
  };

  try {
      const response = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.slice(1, -1)}`,
          },
          body: JSON.stringify(query),
      });

      if (!response.ok) throw new Error('Failed to fetch data.');

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching data:', error);
      return null;
  }
};

export default fetchData;
