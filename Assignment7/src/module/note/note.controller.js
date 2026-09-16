import { Router } from "express";
import * as noteService from "./note.service.js";
import { response } from "../../common/index.js";

export const noteRouter = Router();

noteRouter.post("/create", async (req, res, next) => {
  const { id } = req.query,
    noteData = req.body;
  try {
    const note = await noteService.creatNote({ id, noteData });
    return response({
      res,
      msg: "Note created",
      data: note,
      status: 201,
    });
  } catch (e) {
    next(e);
  }
});

noteRouter.patch("/updateNoteTitle", async (req, res, next) => {
  const { id } = req.query;
  const { title } = req.body;
  try {
    const notes = await noteService.updateNoteTitle({ id, title });
    return response({
      res,
      msg: "All notes updated",
      data: notes,
    });
  } catch (e) {
    next(e);
  }
});

noteRouter.delete("/delete", async (req, res, next) => {
  const { userId } = req.query;
  const { noteId } = req.body;
  try {
    const notes = await noteService.deleteNote({ userId, noteId });
    return response({
      res,
      msg: "Note deleted",
      data: notes,
    });
  } catch (e) {
    next(e);
  }
});

noteRouter.get("/userNotes", async (req, res, next) => {
  const { userId, page, limit } = req.query;
  try {
    const notes = await noteService.userNotes({ userId, page, limit });
    return response({
      res,
      msg: page > notes.totalPage ? "No notes found" : "Notes fetched",
      data: notes,
    });
  } catch (e) {
    next(e);
  }
});

noteRouter.get("/userNote", async (req, res, next) => {
  const { userId } = req.query;
  const { noteId } = req.body;
  console.log(userId, noteId);

  try {
    const note = await noteService.note({ userId, noteId });
    return response({
      res,
      msg: "Note fetched",
      data: note,
    });
  } catch (e) {
    next(e);
  }
});

noteRouter.get("/noteByContent", async (req, res, next) => {
  const { userId } = req.query;
  const { searchQuery } = req.body;
  console.log(userId, searchQuery);

  try {
    const note = await noteService.noteByContent({ userId, searchQuery });
    return response({
      res,
      msg: note.length > 1 ? "Notes fetched" : "Note fetched",
      data: note,
    });
  } catch (e) {
    next(e);
  }
});

noteRouter.put("/replace/:noteId", async (req, res, next) => {
  const { noteId } = req.params;
  const { id } = req.query;
  const updatedData = req.body;
  try {
    const note = await noteService.replaceNote({ id, noteId, updatedData });
    return response({
      res,
      message: "Replaced",
      data: note,
    });
  } catch (e) {
    next(e);
  }
});

noteRouter.patch("/:noteId", async (req, res, next) => {
  const { noteId } = req.params;
  const { id } = req.query;
  const updatedData = req.body;
  try {
    const note = await noteService.updateNote({ id, noteId, updatedData });
    return response({
      res,
      msg: "Updated",
      data: note,
    });
  } catch (e) {
    next(e);
  }
});

// Task 10: GET /notes/note-with-user
noteRouter.get("/note-with-user", async (req, res, next) => {
  const id = req.query.id || req.query.userId;
  try {
    const notes = await noteService.getNotesWithUser({ id });
    return res.status(200).json(notes);
  } catch (e) {
    next(e);
  }
});

// Task 11: GET /notes/aggregate
noteRouter.get("/aggregate", async (req, res, next) => {
  const id = req.query.id || req.query.userId;
  const { title } = req.query;
  try {
    const notes = await noteService.aggregateNotes({ id, title });
    return res.status(200).json(notes);
  } catch (e) {
    next(e);
  }
});

// Task 12: DELETE /notes
noteRouter.delete("/", async (req, res, next) => {
  const id = req.query.id || req.query.userId;
  try {
    await noteService.deleteAllNotes({ id });
    return res.status(200).json({
      message: "Deleted",
    });
  } catch (e) {
    next(e);
  }
});
