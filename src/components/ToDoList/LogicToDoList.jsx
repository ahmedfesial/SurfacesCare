import React, { useState } from "react";

const initialBoard = {
  columns: [
    {
      id: 1,
      title: "Backlog",
      projects: [
        { id: 101, name: "CRM System dasdasda", description: "Internal company CRM", status: "Pending" },
        { id: 102, name: "E-commerce App", description: "Online store project", status: "Pending" }
      ]
    },
    {
      id: 2,
      title: "Doing",
      projects: [
        { id: 103, name: "Mobile Banking", description: "Banking app for iOS/Android", status: "In Progress" }
      ]
    },
    { id: 3, title: "Q&A", projects: [] },
    { id: 4, title: "Production", projects: [] }
  ]
};

// ألوان لكل حالة
const statusColors = {
  Pending: "bg-gray-200 text-gray-700",
  "In Progress": "bg-yellow-200 text-yellow-800",
  QA: "bg-purple-200 text-purple-800",
  Done: "bg-green-200 text-green-800",
  Blocked: "bg-red-200 text-red-800"
};

// خريطة العمود للحالة
const columnStatusMap = {
  1: "Pending",       // Backlog
  2: "In Progress",   // Doing
  3: "QA",            // Q&A
  4: "Done"           // Production
};

export default function KanbanBoard() {
  const [board, setBoard] = useState(initialBoard);
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [dragOverColumnId, setDragOverColumnId] = useState(null);
  const [dragOverCardId, setDragOverCardId] = useState(null);

  // 🟢 يبدأ سحب كارت
  const handleDragStartCard = (card, fromColumnId, fromIndex) => {
    setDraggedCard({ ...card, fromColumnId, fromIndex });
  };

  // 🟢 يبدأ سحب عمود
  const handleDragStartColumn = (col, fromIndex) => {
    setDraggedColumn({ ...col, fromIndex });
  };

  // 🟢 إفلات الكارت
  const handleDropCard = (toColumnId, toIndex) => {
    if (!draggedCard) return;

    const newStatus = columnStatusMap[toColumnId] || draggedCard.status;

    setBoard((prev) => {
      const newBoard = { ...prev };

      // حذف الكارت من العمود القديم
      newBoard.columns = newBoard.columns.map((col) =>
        col.id === draggedCard.fromColumnId
          ? { ...col, projects: col.projects.filter((p) => p.id !== draggedCard.id) }
          : col
      );

      // إضافة الكارت للعمود الجديد مع الحالة الجديدة
      newBoard.columns = newBoard.columns.map((col) => {
        if (col.id === toColumnId) {
          const newProjects = [...col.projects];
          const updatedCard = { ...draggedCard, status: newStatus };
          if (typeof toIndex === "number") {
            newProjects.splice(toIndex, 0, updatedCard);
          } else {
            newProjects.push(updatedCard);
          }
          return { ...col, projects: newProjects };
        }
        return col;
      });

      return newBoard;
    });

    setDraggedCard(null);
    setDragOverColumnId(null);
    setDragOverCardId(null);
  };

  // 🟢 إفلات عمود
  const handleDropColumn = (toIndex) => {
    if (!draggedColumn) return;
    setBoard((prev) => {
      const newColumns = [...prev.columns];
      newColumns.splice(draggedColumn.fromIndex, 1);
      newColumns.splice(toIndex, 0, draggedColumn);
      return { ...prev, columns: newColumns };
    });

    setDraggedColumn(null);
    setDragOverColumnId(null);
  };

  // إضافة عمود جديد
  const handleAddColumn = () => {
    const newId = board.columns.length ? Math.max(...board.columns.map(c => c.id)) + 1 : 1;
    const newColumn = {
      id: newId,
  title: "New Column",
      projects: []
    };
    setBoard(prev => ({ ...prev, columns: [...prev.columns, newColumn] }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* زر إضافة عمود جديد */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddColumn}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors duration-200"
        >
          + إضافة عمود جديد
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {board.columns.map((col, colIndex) => (
          <div
            key={col.id}
            onDrop={(e) => {
              if (draggedColumn) {
                e.stopPropagation();
                handleDropColumn(colIndex);
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverColumnId(col.id);
            }}
            onDragLeave={() => setDragOverColumnId(null)}
            className={`rounded-lg shadow p-4 transition-colors duration-200 ${
              dragOverColumnId === col.id ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            {/* عنوان العمود - فقط العنوان قابل للسحب */}
            <h2
              className="font-bold text-lg mb-3 cursor-move select-none"
              draggable
              onDragStart={() => handleDragStartColumn(col, colIndex)}
            >
              {col.title}
            </h2>

            {/* الكروت */}
            <div className="space-y-3">
              {col.projects.map((card, cardIndex) => (
                <div
                  key={card.id}
                  draggable={true}
                  onDragStart={(e) => {
                    e.stopPropagation();
                    handleDragStartCard(card, col.id, cardIndex);
                  }}
                  onDrop={(e) => {
                    if (draggedCard) {
                      e.stopPropagation();
                      handleDropCard(col.id, cardIndex);
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverCardId(card.id);
                  }}
                  onDragLeave={() => setDragOverCardId(null)}
                  className={`p-3 rounded-lg shadow border cursor-move transition-colors duration-200 ${
                    dragOverCardId === card.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {/* الحالة */}
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[card.status]}`}
                  >
                    {card.status}
                  </span>

                  {/* المحتوى */}
                  <h5 className="font-semibold text-gray-800 mt-2">{card.name}</h5>
                  <p className="text-sm text-gray-600">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}