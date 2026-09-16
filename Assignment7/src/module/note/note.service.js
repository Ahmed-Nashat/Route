import mongoose from "mongoose";
import { exceptions } from "../../common/index.js";
import { userModel } from "../../db/model/user.model.js";
import { noteModel } from "../../db/model/note.model.js";

export const creatNote = async ({ id: userId, noteData }) => {
  const user = await userModel.findById(userId);
  if (!user) exceptions.notFound("User not found");

  const note = await noteModel.create(noteData);
  const { userId: ignored, ...rest } = note.toObject();

  return {
    ...rest,
    userName: user.name,
  };
};

export const updateNote = async ({ id: userId, noteId, updatedData }) => {
  const note = await noteModel.findById(noteId);
  if (!note) exceptions.notFound("Note not found");

  if (note.userId.toString() !== userId.toString()) {
    exceptions.forbidden("You are not the owner");
  }

  delete updatedData?._id;

  return await noteModel.findByIdAndUpdate(
    noteId,
    { $set: updatedData },
    { new: true },
  );
};

export const replaceNote = async ({ id: userId, noteId, updatedData }) => {
  const note = await noteModel.findById(noteId);
  if (!note) exceptions.notFound("Note not found");

  if (note.userId.toString() !== userId.toString()) {
    exceptions.forbidden("You are not the owner");
  }

  delete updatedData?._id;
  updatedData.userId = userId;

  return await noteModel.findOneAndReplace({ _id: noteId }, updatedData, {
    new: true,
  });
};

export const updateNoteTitle = async ({ id: userId, title: newTitle }) => {
  const result = await noteModel.updateMany(
    { userId },
    { $set: { title: newTitle } },
  );

  if (result.matchedCount === 0) {
    exceptions.notFound("No notes found for this user");
  }

  return await noteModel.find({ userId });
};

export const deleteNote = async ({ userId, noteId }) => {
  const user = await userModel.findById(userId);
  if (!user) exceptions.notFound("User not found");

  const note = await noteModel.findById(noteId);
  if (!note) exceptions.notFound("Note not found");

  if (userId != note.userId)
    exceptions.forbidden("You are not the owner of this note");

  return {
    note,
    userName: user?.name,
  };
};

export const userNotes = async ({ userId, page, limit }) => {
  const user = await userModel.findById(userId);
  if (!user) exceptions.notFound("User not found");

  page = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);
  limit = isNaN(Number(limit)) || Number(limit) < 1 ? 10 : Number(limit);
  const skip = (page - 1) * limit;

  const [rows, count] = await Promise.all([
    noteModel.find({ userId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
    noteModel.countDocuments({ userId }),
  ]);

  return {
    count,
    totalPage: Math.ceil(count / limit),
    currentPage: page,
    notes: rows,
  };
};

export const note = async ({ userId, noteId }) => {
  const user = await userModel.findById(userId);
  if (!user) exceptions.notFound("User not found");

  const note = await noteModel.findById(noteId);
  if (!note) exceptions.notFound("Note not found");

  if (userId != note.userId)
    exceptions.forbidden("You are not the owner of this note");

  console.log(note);

  return note;
};

export const noteByContent = async ({ userId, searchQuery }) => {
  const user = await userModel.findById(userId);
  if (!user) exceptions.notFound("User not found");

  const notes = await noteModel.find({
    userId,
    content: { $regex: searchQuery, $options: "i" },
  });
  if (!notes.length) {
    exceptions.notFound("No notes found matching this content");
  }
  return notes;
};

// Task 10: Retrieves notes with user email
export const getNotesWithUser = async ({ id: userId }) => {
  const user = await userModel.findById(userId);
  if (!user) exceptions.notFound("User not found");

  const notes = await noteModel
    .find({ userId })
    .select("title userId createdAt")
    .populate({
      path: "userId",
      select: "email -_id",
    })
    .lean();

  return notes;
};

// Task 11: Aggregation with user information and title search
export const aggregateNotes = async ({ id: userId, title }) => {
  const user = await userModel.findById(userId);
  if (!user) exceptions.notFound("User not found");

  const match = {
    userId: new mongoose.Types.ObjectId(userId),
  };

  if (title) {
    match.title = { $regex: title, $options: "i" };
  }

  const notes = await noteModel.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        title: 1,
        userId: 1,
        createdAt: 1,
        user: {
          name: "$user.name",
          email: "$user.email",
        },
      },
    },
  ]);

  return notes;
};

// Task 12: Delete all notes for user
export const deleteAllNotes = async ({ id: userId }) => {
  const user = await userModel.findById(userId);
  if (!user) exceptions.notFound("User not found");

  await noteModel.deleteMany({ userId });
  return { message: "Deleted" };
};
