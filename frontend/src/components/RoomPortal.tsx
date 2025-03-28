import React, { useEffect, useState } from "react";
import {
  PlusIcon,
  SearchIcon,
  TrashIcon,
  EditIcon,
  Loader2Icon,
} from "lucide-react";
import { API } from "../services/api";

interface Room {
  id: number;
  name: string;
  building: string;
  department: string;
  capacity: number;
  availability: string;
  type: number;
}

interface RoomPortalProps {
  autoOpenForm?: boolean;
  onMount?: () => void;
}

interface RoomFormProps {
  room: {
    name: string;
    building: string;
    department: string;
    capacity: number;
    type: number;
  };
  setRoom: React.Dispatch<
    React.SetStateAction<{
      name: string;
      building: string;
      department: string;
      capacity: number;
      type: number;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
  isLoading: boolean;
}

const RoomForm: React.FC<RoomFormProps> = ({
  room,
  setRoom,
  onSubmit,
  onCancel,
  isEditing,
  isLoading,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {isEditing ? "Edit Room" : "Add New Room"}
      </h2>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Room ID
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={room.name}
              onChange={(e) => setRoom({ ...room, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label
              htmlFor="building"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Building
            </label>
            <select
              id="building"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={room.building}
              onChange={(e) => setRoom({ ...room, building: e.target.value })}
              required
            >
              <option value="">Select Building</option>
              <option value="CS Building">CS Building</option>
              <option value="Science Complex">Science Complex</option>
              <option value="Engineering Block">Engineering Block</option>
              <option value="Math Department">Math Department</option>
              <option value="Physics Lab">Physics Lab</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Department
            </label>
            <input
              type="text"
              id="department"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={room.department}
              onChange={(e) => setRoom({ ...room, department: e.target.value })}
              required
            />
          </div>
          <div>
            <label
              htmlFor="capacity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Room Capacity
            </label>
            <input
              type="number"
              id="capacity"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={room.capacity}
              onChange={(e) =>
                setRoom({ ...room, capacity: parseInt(e.target.value) })
              }
              required
            />
          </div>
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Room Type
            </label>
            <select
              id="type"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={room.type}
              onChange={(e) =>
                setRoom({ ...room, type: parseInt(e.target.value) })
              }
              required
            >
              <option value={1}>Lecture Hall</option>
              <option value={2}>Laboratory</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 mr-2 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            disabled={isLoading}
          >
            {isLoading && (
              <Loader2Icon className="animate-spin mr-2" size={18} />
            )}
            {isEditing ? "Update Room" : "Save Room"}
          </button>
        </div>
      </form>
    </div>
  );
};

interface RoomTableProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

const RoomTable: React.FC<RoomTableProps> = ({
  rooms,
  onEdit,
  onDelete,
  isLoading,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Room ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Building
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Capacity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rooms.map((room) => (
            <tr key={room.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {room.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {room.building}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {room.department}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {room.capacity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {room.type === 1 ? "Lecture Hall" : "Laboratory"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  className="text-blue-600 hover:text-blue-900 mr-3"
                  onClick={() => onEdit(room)}
                  disabled={isLoading}
                >
                  <EditIcon size={18} />
                </button>
                <button
                  className="text-red-600 hover:text-red-900"
                  onClick={() => onDelete(room.id)}
                  disabled={isLoading}
                >
                  <TrashIcon size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RoomPortal: React.FC<RoomPortalProps> = ({
  autoOpenForm = false,
  onMount,
}) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showAddForm, setShowAddForm] = useState(autoOpenForm);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newRoom, setNewRoom] = useState({
    name: "",
    building: "",
    department: "",
    capacity: 0,
    type: 1,
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        // const data = await API.getRooms();
        // setRooms(data);

        // Mock data for demonstration
        const mockRooms: Room[] = [
          {
            id: 1,
            name: "CS101",
            building: "CS Building",
            department: "Computer Science",
            capacity: 50,
            availability: "Available",
            type: 1,
          },
          {
            id: 2,
            name: "LAB202",
            building: "Science Complex",
            department: "Physics",
            capacity: 30,
            availability: "Available",
            type: 2,
          },
        ];
        setRooms(mockRooms);
      } catch (err) {
        setError("Failed to load rooms. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
    if (onMount) onMount();
  }, [onMount]);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsLoading(true);

      const roomData = {
        id: editingRoom?.id || Math.max(0, ...rooms.map((r) => r.id)) + 1,
        name: newRoom.name,
        building: newRoom.building,
        department: newRoom.department,
        capacity: newRoom.capacity,
        availability: "Available", // Default availability
        type: newRoom.type,
      };

      if (editingRoom) {
        // const updatedRoom = await API.updateRoom(roomData);
        // setRooms(rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
        setRooms(rooms.map((r) => (r.id === roomData.id ? roomData : r)));
      } else {
        // const savedRoom = await API.addRoom(roomData);
        // setRooms([...rooms, savedRoom]);
        setRooms([...rooms, roomData]);
      }

      resetForm();
    } catch (err) {
      setError(
        editingRoom
          ? "Failed to update room. Please try again."
          : "Failed to add room. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setNewRoom({
      name: room.name,
      building: room.building,
      department: room.department,
      capacity: room.capacity,
      type: room.type,
    });
    setShowAddForm(true);
  };

  const handleDeleteRoom = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      setIsLoading(true);
      // await API.deleteRoom(id);
      setRooms(rooms.filter((room) => room.id !== id));
    } catch (err) {
      setError("Failed to delete room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewRoom({
      name: "",
      building: "",
      department: "",
      capacity: 0,
      type: 1,
    });
    setEditingRoom(null);
    setShowAddForm(false);
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && rooms.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2Icon className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Header and Add Button */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Room Management</h1>
          <p className="mt-1 text-gray-600">
            Add and manage rooms for timetable generation
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors"
          disabled={isLoading}
        >
          <PlusIcon size={18} className="mr-2" />
          {showAddForm ? "Cancel" : "Add Room"}
        </button>
      </div>

      {/* Room Form */}
      {showAddForm && (
        <RoomForm
          room={newRoom}
          setRoom={setNewRoom}
          onSubmit={handleAddRoom}
          onCancel={resetForm}
          isEditing={!!editingRoom}
          isLoading={isLoading}
        />
      )}

      {/* Room List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Room List</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm
                ? "No rooms match your search."
                : "No rooms added yet. Click 'Add Room' to get started."}
            </p>
          </div>
        ) : (
          <RoomTable
            rooms={filteredRooms}
            onEdit={handleEditRoom}
            onDelete={handleDeleteRoom}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default RoomPortal;
