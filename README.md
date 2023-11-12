# Online Learning Platform - Intern Test Documentation

## Description

This repository contains the backend code for an online learning platform. The documentation provides instructions for installation, API usage, and details about user authentication and admin user management.

Live Heroku : https://elemes-backend-intern-test-2005bcca088a.herokuapp.com/

## Installation

### Step 1: Clone Repository

```bash
git clone
cd backend-test-elemes
```

### Step 2: Initialize Project

Create a `.env` file in the project root with the following environment variables:

```env
DATABASE_URL="mysql://<username:<password>@<host>:3306/elemes" 
JWT_ACCESS_SECRET=""
JWT_REFRESH_SECRET=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

Replace `<username:<password>@<host>` with your MySQL database connection details. Get Cloudinary credentials from the Cloudinary dashboard for image storage.

Initialize the project:

```bash
npm install -g pnpm
pnpm install
```

Migrate the database:

```bash
npx prisma generate
npx prisma migrate dev
```

### Step 3: Run The App

#### Development

```bash
pnpm run dev
```

#### Build and Start

```bash
pnpm run build
pnpm run start
```

Access the app at http://localhost:8000/.

## API Documentation

### User Authentication Endpoints

#### Register User

- **Endpoint**: `POST /register`
- **Description**: Register a new user and generate access and refresh tokens.

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "user_password"
}
```

**Response:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "accessToken": "generated_access_token"
}
```

**Error Responses:**
- **409 Conflict**
  ```json
  {
    "status": "fail",
    "message": "Email Already Exist"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "error": "Internal Server Error Message"
  }
  ```

#### User Login

- **Endpoint**: `POST /login`
- **Description**: Authenticate a user and generate access and refresh tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "user_password"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "accessToken": "generated_access_token"
  }
}
```

**Error Responses:**
- **401 Unauthorized**
  ```json
  {
    "status": "fail",
    "message": "Email Or Password Wrong"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "error": "Internal Server Error Message"
  }
  ```

#### Refresh Token

- **Endpoint**: `GET /refresh-token`
- **Description**: Refresh the user's access token using the stored refresh token.

**Response:**
```json
{
  "accessToken": "newly_generated_access_token"
}
```

**Error Responses:**
- **401 Unauthorized**
  ```json
  {
    "error": "Unauthorized"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "error": "Internal Server Error Message"
  }
  ```

Note: Secure cookie settings (`httpOnly: true`, `secure: true`, `sameSite: 'none'`) are required for all endpoints, especially for the refresh token.

### Admin User Management

#### Soft Delete User

- **Endpoint**: `PUT /admin/user/:id`
- **Description**: Soft delete a user by providing the user ID.

**Request Parameters:**
- `id` (string, required): The ID of the user to be soft deleted.

**Response:**
```json
{
  "status": "success",
  "message": "User soft deleted successfully"
}
```

**Error Responses:**
- **404 Not Found**
  ```json
  {
    "message": "User not found"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "message": "Error deleting user"
  }
  ```

#### Simple Statistic

- **Endpoint**: `GET /admin/simple-statistic`
- **Description**: Retrieve simple statistics, such as the total number of users and courses.

**Response:**
```json
{
  "user": 100,
  "course": 50
}
```

**Error Response:**
- **500 Internal Server Error**
  ```json
  {
    "error": "Internal Server Error Message"
  }
```

Note: Admin endpoints require valid admin privileges, verified by the `verifyToken` and `requireAdmin` middleware. The `softDeleteUser` endpoint marks the user as deleted, and the `simpleStatistic` endpoint retrieves basic statistics.

## Category Endpoint  

### Create Category

#### Description
This API allows an admin user to create a new category.

- **Endpoint**: `POST /category`
- **Authentication**: Requires a valid user token with admin privileges.

**Request Body:**
```json
{
  "name": "Category Name"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    // Newly created category information
  }
}
```

**Error Responses:**
- **400 Bad Request**
  ```json
  {
    "status": "fail",
    "message": "Data name must be included and must be of type string"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "error": "Internal Server Error Message"
  }
  ```

### Popular Category

#### Description
This API allows a user to get popular categories.

- **Endpoint**: `GET /popular`
- **Authentication**: Requires a valid user token with user privileges.

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "categoryId": "85faba44-f891-4fd0-923e-58a0f18e3644",
      "categoryName": "ReactJS",
      "enrollmentCount": 1
    },
    // ...
  ]
}
```

**Error Responses:**
- **500 Internal Server Error**
  ```json
  {
    "error": "Internal Server Error Message"
  }
  ```

### Get All Categories

#### Description
This API allows a user to get all categories.

- **Endpoint**: `GET /category`
- **Authentication**: Requires a valid user token with user privileges.

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "06745845-4ada-46f7-b4fd-43cd5e79225d",
      "name": "Pertualangan",
      "createdAt": "2023-11-12T18:05:44.677Z",
      "updatedAt": "2023-11-12T18:05:44.677Z"
    },
    // ...
  ]
}
```

**Error Responses:**
- **500 Internal Server Error**
  ```json
  {
    "error": "Internal Server Error Message"
  }
  ```

## Course Endpoint

  

### Search for Courses

#### Description
This API allows users to search for courses based on the provided name.

- **Endpoint**: `GET /course/search/:name?`
- **Authentication**: Requires a valid user token.

**Query Parameters:**
- `name` (string, optional): The name of the course to search for.

**Response:**
###### Success Response (200 OK)
```json
{
  "status": "success",
  "data": [
    // List of courses matching the search criteria
  ]
}
```

###### Error Response
- **500 Internal Server Error**
  ```json
  {
    "error": "Internal Server Error Message"
  }
  ```

### Update Course

#### Description
This API allows an admin user to update a specific course by providing the course ID.

- **Endpoint**: `PUT /admin/course/:id`
- **Authentication**: Requires a valid admin token.

**Path Parameters:**
- `id` (string, required): The ID of the course to be updated.

**Request Body:**
```json
{
  "name": "Updated Course Name",
  "price": 39.99,
  "description": "Updated Course Description"
}
```

**Response:**
###### Success Response (200 OK)
```json
{
  "status": "success",
  "data": {
    // Updated course information
  }
}
```

**Error Responses:**
- **404 Not Found**
  ```json
  {
    "status": "fail",
    "message": "Course not found"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "error": "Internal Server Error Message"
  }
  ```

### Delete Course

#### Description
This API allows an admin user to delete a specific course by providing the course ID.

- **Endpoint**: `DELETE /admin/course/:id`
- **Authentication**: Requires a valid admin token.

**Path Parameters:**
- `id` (string, required): The ID of the course to be deleted.

**Response:**
###### Success Response (200 OK)
```json
{
  "status": "success",
  "data": {
    // Deleted course information
  }
}
```

**Error Responses:**
- **404 Not Found**
  ```json
  {
    "status": "fail",
    "message": "Course not found"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "error": "Internal Server Error Message"
  }
  ```

### Create Course with Image Upload

#### Description
This API allows an admin user to create a new course with an optional image upload.

- **Endpoint**: `POST /admin/course`
- **Authentication**: Requires a valid admin token.
- **File Upload**: Supports image upload using `multerUploud` middleware.

**Request Body:**
```json
{
  "name": "New Course Name",
  "price": 29.99,
  "description": "Course Description",
  "categoryId": "category_id"
}
```

**File Upload (Image):**
The image file should be sent as part of the `multipart/form-data` request.

**Response:**
###### Success Response (201 Created)
```json
{
  "status": "success",
  "data": {
    "name": "New Course Name",
    "price": 29.99,
    "description": "Course Description",
    "categoryId": "category_id",
    "image": "image_url"
  }
}
```

**Error Responses:**
- **400 Bad Request**
  ```json
  {
    "status": "fail",
    "message": "Validation Error Message"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "error": "Internal Server Error Message"
  }
  ```

### Course Enrollment

#### Description
This API allows a user to enroll in a specific course.

- **Endpoint**: `POST /course/enrollment/:id`
- **Authentication**: Requires a valid user token.

**Path Parameters:**
- `id` (string, required): The ID of the course to be enrolled in.

**Response:**
###### Success Response (201 Created)
```json
{
  "status": "success",
  "data": {
    // Enrollment information
  }
}
```

**Error Responses:**
- **409 Conflict**
  ```json
  {
    "status": "fail",
    "message": "User is already enrolled in the course"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "error": "Internal Server Error Message"
  }
  ```

### Get Courses

This endpoint retrieves a list of courses based on specified conditions.

- **Endpoint:** `GET /courses`
- **Authentication:** Requires a valid user token.

**Query Parameters:**

- `id` (string, optional): The ID of a specific course to retrieve.
- `sort` (string, optional): Sort courses by price. Possible values: `"asc"` (ascending) or `"desc"` (descending).

**Response:**

- **Success Response (200 OK):**
  - If a specific course ID is provided:
    ```json
    {
      "status": "success",
      "data": {
        // Course details
      }
    }
    ```
  - If sorting by price:
    ```json
    {
      "status": "success",
      "data": [
        // List of courses sorted by price
      ]
    }
    ```
  - If no specific conditions are provided:
    ```json
    {
      "status": "success",
      "data": [
        // List of all courses
      ]
    }
    ```

**Error Responses:**

- **404 Not Found:**
  - If the specified course ID is not found:
    ```json
    {
      "status": "fail",
      "message": "Course not found"
    }
    ```
- **500 Internal Server Error:**
  - If there is an internal server error during the course retrieval process:
    ```json
    {
      "error": "Internal Server Error Message"
    }
    ```

**Examples:**

1. Retrieve a specific course by ID:
   - **Request:**
     ```
     GET /courses?id=course_id
     ```
   - **Response:**
     ```json
     {
       "status": "success",
       "data": {
         // Course details
       }
     }
     ```

2. Retrieve all courses:
   - **Request:**
     ```
     GET /courses
     ```
   - **Response:**
     ```json
     {
       "status": "success",
       "data": [
         // List of all courses
       ]
     }
     ```

3. Sort courses by price in descending order:
   - **Request:**
     ```
     GET /courses?sort=desc
     ```
   - **Response:**
     ```json
     {
       "status": "success",
       "data": [
         // List of courses sorted by price in descending order
       ]
     }
     ```
