import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


  function authorize(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Authorization token not provided' });
    }
    console.log({token});
  
    try {
      const decodedToken = jwt.verify(token, process.env.TOKEN);
      console.log({decodedToken});
     
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }

  function authorizeStudent(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Authorization token not provided' });
    }
    console.log({token});
  
    try {
      const decodedToken = jwt.verify(token, process.env.TOKEN);
      if (decodedToken.role !== 'Admin' && decodedToken.role !== 'Student' ) {
        return res.status(403).json({ message: 'Access forbidden for non-Admin users' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }

  function authorizeTeacher(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Authorization token not provided' });
    }
    console.log({token});
  
    try {
      const decodedToken = jwt.verify(token, process.env.TOKEN);
      if (decodedToken.role !== 'Admin' && decodedToken.role !== 'Teacher' ) {
        return res.status(403).json({ message: 'Access forbidden for non-Admin users' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }

  function authorizeStudent(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Authorization token not provided' });
    }
    console.log({token});
  
    try {
      const decodedToken = jwt.verify(token, process.env.TOKEN);
      if (decodedToken.role !== 'Admin' && decodedToken.role !== 'Student' ) {
        return res.status(403).json({ message: 'Access forbidden for non-Admin users' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }


  export {authorize , authorizeStudent ,authorizeAlumni , authorizeTeacher};