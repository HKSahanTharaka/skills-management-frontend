import { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import Input from '../common/Input';
import { formatDisplayDate } from '../../utils/helpers';

const AvailabilityCalendar = ({ personnelId, availabilityData, onAddPeriod, onEditPeriod, onDeletePeriod }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    availabilityPercentage: 100,
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAvailabilityForDate = (date) => {
    if (!availabilityData) return null;

    return availabilityData.find((period) => {
      const start = new Date(period.start_date);
      const end = new Date(period.end_date);
      return date >= start && date <= end;
    });
  };

  const getAvailabilityColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleAddClick = () => {
    setFormData({
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      availabilityPercentage: 100,
    });
    setShowAddModal(true);
  };

  const handleEditClick = (period) => {
    setSelectedPeriod(period);
    setFormData({
      startDate: format(new Date(period.start_date), 'yyyy-MM-dd'),
      endDate: format(new Date(period.end_date), 'yyyy-MM-dd'),
      availabilityPercentage: period.availability_percentage,
    });
    setShowEditModal(true);
  };

  const handleSubmitAdd = () => {
    onAddPeriod({
      personnelId,
      ...formData,
    });
    setShowAddModal(false);
  };

  const handleSubmitEdit = () => {
    onEditPeriod({
      id: selectedPeriod.id,
      ...formData,
    });
    setShowEditModal(false);
  };

  const handleDelete = (periodId) => {
    if (window.confirm('Are you sure you want to delete this availability period?')) {
      onDeletePeriod(periodId);
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handlePrevMonth} size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <Button variant="ghost" onClick={handleNextMonth} size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="primary" onClick={handleAddClick} leftIcon={<Plus className="h-4 w-4" />}>
            Add Period
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 bg-gray-50">
            {weekDays.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {Array.from({ length: monthStart.getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="p-2 border-r border-b border-gray-200 bg-gray-50" />
            ))}

            {daysInMonth.map((day) => {
              const availability = getAvailabilityForDate(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className={`p-2 border-r border-b border-gray-200 min-h-20 ${!isSameMonth(day, currentDate) ? 'bg-gray-50' : ''
                    } ${isToday ? 'bg-primary-50' : ''}`}
                >
                  <div className="flex flex-col h-full">
                    <span className={`text-sm ${isToday ? 'font-bold text-primary-600' : 'text-gray-700'}`}>
                      {format(day, 'd')}
                    </span>
                    {availability && (
                      <div className="mt-1 flex-1 flex flex-col justify-center">
                        <div className={`text-xs text-center py-1 px-1 rounded text-white ${getAvailabilityColor(availability.availability_percentage)}`}>
                          {availability.availability_percentage}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Availability Periods List */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Availability Periods</h4>
          {availabilityData && availabilityData.length > 0 ? (
            <div className="space-y-2">
              {availabilityData.map((period) => (
                <div
                  key={period.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDisplayDate(period.start_date)} - {formatDisplayDate(period.end_date)}
                      </p>
                    </div>
                    <Badge variant={period.availability_percentage >= 80 ? 'green' : period.availability_percentage >= 50 ? 'yellow' : 'red'}>
                      {period.availability_percentage}%
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(period)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(period.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No availability periods defined</p>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">Legend:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-gray-700">80-100%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded" />
            <span className="text-gray-700">50-79%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded" />
            <span className="text-gray-700">20-49%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span className="text-gray-700">0-19%</span>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Availability Period"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmitAdd} className="flex-1">
              Add Period
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
          <Input
            label="Availability Percentage"
            type="number"
            min="0"
            max="100"
            value={formData.availabilityPercentage}
            onChange={(e) => setFormData({ ...formData, availabilityPercentage: Number(e.target.value) })}
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Availability Period"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmitEdit} className="flex-1">
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
          <Input
            label="Availability Percentage"
            type="number"
            min="0"
            max="100"
            value={formData.availabilityPercentage}
            onChange={(e) => setFormData({ ...formData, availabilityPercentage: Number(e.target.value) })}
          />
        </div>
      </Modal>
    </Card>
  );
};

export default AvailabilityCalendar;

