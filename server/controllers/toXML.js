// const { UserTable, Activity } = require("../models/schema");

// //querys the database to retrieve several Activity_ID's from activities table according to the value passed
// const activityIDNode = async (columnName, value) => {
//   try {
//     const activities = await Activity.find(
//       { [columnName]: value },
//       "activities_id"
//     );

//     // Assuming you want to build nodes similar to your PHP function
//     activities.forEach((activity) => {
//       buildNode(fet, parent, "Activity_Id", activity.activities_id);
//     });

//     // If you only need the activities_id as an array (without building nodes)
//     return activities.map((activity) => activity.activities_id);
//   } catch (err) {
//     console.error("Error fetching activities:", err);
//     throw err;
//   }
// };

// //querys the database to retrieve Institution_Name from userTables table

// const getInstitution = async (columnName, value) => {
//   try {
//     // Querying the UserTable collection based on the column name and value
//     const institutions = await UserTable.find(
//       { [columnName]: value },
//       "institution_name" // Only fetching the institution_name field
//     );

//     // Assuming you want to build nodes similar to your PHP function
//     institutions.forEach((institution) => {
//       buildNode(fet, parent, "institution_name", institution.institution_name);
//     });

//     // If you only need the institution_name as an array (without building nodes)
//     return institutions.map((institution) => institution.institution_name);
//   } catch (err) {
//     console.error("Error fetching institution name:", err);
//     throw err;
//   }
// };

// //querys the database to retrieve Comments from user_tables table

// const getComments = async (columnName, value) => {
//   try {
//     const commentss = await UserTable.find(
//       { [columnName]: value },
//       "institution_name"
//     );

//     // Assuming you want to build nodes similar to your PHP function
//     commentss.forEach((comments) => {
//       buildNode(fet, parent, "comments", comments.comments);
//     });

//     return commentss.map((comments) => comments.comments);
//   } catch (err) {
//     console.error("Error fetching comments:", err);
//     throw err;
//   }
// };

// const getHours = async (userTableID) => {
//     try {
//       // Query to get hour_name from Hours collection based on userTableID
//       const hoursList = await Hours.find({ user_table_id: userTableID })
//                                    .select('hour_name') // Select only the hour_name field
//                                    .exec();

//       // Create an object or array to hold the response in the required format
//       const response = {
//         Hours_List: hoursList.map(hour => ({ Name: hour.hour_name })),
//       };

//       return response;
//     } catch (error) {
//       console.error('Error fetching hours:', error);
//       throw new Error('Error fetching hours');
//     }
//   };
