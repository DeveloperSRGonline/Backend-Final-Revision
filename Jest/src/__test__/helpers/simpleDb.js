// Simple in-memory database simulator
// This simulates MongoDB for learning purposes

class SimpleDatabase {
  constructor() {
    this.data = [];
    this.isActive = false;
  }

  // Simulate activate() - start the database
  activate() {
    this.isActive = true;
    console.log("📦 Database activated");
  }

  // Simulate clean() - clear all data
  clean() {
    this.data = [];
    console.log("🧹 Database cleaned");
  }

  // Insert a document
  insert(document) {
    if (!this.isActive) {
      throw new Error("Database not activated");
    }
    this.data.push({ ...document, _id: Date.now() });
    console.log("➕ Inserted:", document);
  }

  // Find all documents
  find() {
    if (!this.isActive) {
      throw new Error("Database not activated");
    }
    return this.data;
  }

  // Close database
  close() {
    this.isActive = false;
    this.data = [];
    console.log("🔌 Database closed");
  }
}

module.exports = SimpleDatabase;
