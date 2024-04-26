const mssql = require("mssql");
const { createClient, cacheExchange, fetchExchange } = require("@urql/core");
const config = {
  server: "Haresh",
  user: "dummyuser2",
  password: "test123",
  database: "datetimetesting",
  options: {
    trustServerCertificate: true,
  },
};
mssql.connect(config, (err) => {
  if (err) {
    console.error("Error connecting to SQL Server:", err);
    return;
  }
  console.log("Connected to SQL Server");
  console.log(performance.now());
  executeStatement();
  console.log(performance.now());
});
function executeStatement() {
  let totalData = 0;
  let remainingData = 0;
  let currentData = 0;
  const request = new mssql.Request();
  const query = "select TOP 100 * from ForneyVaultLogs";
  request.query(query, (err, result) => {
    console.log("🚀 ~ request.query ~ result:", result);
    mssql.close();
    if (err) {
      console.log("Error executing query:", err);
      return;
    }
    totalData = result.recordset.length;
    remainingData = totalData - currentData;
    for (let data of result.recordset) {
      currentData++;

      const { discription, status } = data;
      const name = 23;
      const queryexe = async (description, name, status) => {
        try {
          const client = createClient({
            url: "https://{{api-key}}.appsync-api.us-east-2.amazonaws.com/graphql",
            exchanges: [cacheExchange, fetchExchange],
            fetchOptions: {
              headers: {
                "Content-Type": "application/json",
                "x-api-key": "{{appsync-key}}",
              },
            },
          });
          const mutation = `mutation CreateOrganization($description: String!, $name: String!, $status: String!) {
      createOrganization(input: { description: $description, name: $name, status: $status }) {
        description
        name
        status
      }
    }`;
          const result = await client.mutation(mutation, {
            description,
            name,
            status,
          });
          console.log("Mutation result:", result);
        } catch (error) {
          console.error(
            "Error during migration :: ",
            error,
            "total table trasfered ::",
            currentData,
            "remaining data :: ",
            remainingData,
            "total data :: ",
            totalData
          );
        }
      };
      // queryexe(discription, name, status);
    }
    console.log("🚀 ~ request.query ~ currentData:", currentData);
  });
}
