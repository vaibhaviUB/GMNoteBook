import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome back! 👋</h1>
      <p className="text-lg mb-6">Here's your study overview for today.</p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Notes Created</h2>
          <p className="text-2xl font-bold">24</p>
          <p className="text-sm text-gray-500">+3 this week</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Assessments Taken</h2>
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-gray-500">85% avg score</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Study Streak</h2>
          <p className="text-2xl font-bold">7 days</p>
          <p className="text-sm text-gray-500">Personal best!</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Weekly Goals</h2>
        <div className="mb-2">
          <p>Study Hours (15h goal)</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "70%" }}></div>
          </div>
          <p className="text-sm text-gray-500">10.5 / 15h</p>
        </div>
        <div className="mb-2">
          <p>Quizzes Completed (5 goal)</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "60%" }}></div>
          </div>
          <p className="text-sm text-gray-500">3 / 5</p>
        </div>
        <div className="mb-2">
          <p>Notes Reviewed (10 goal)</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "80%" }}></div>
          </div>
          <p className="text-sm text-gray-500">8 / 10</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link to="/notes" className="bg-blue-100 p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">Notes</p>
        </Link>
        <Link to="/assessments" className="bg-green-100 p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">Assessments</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;