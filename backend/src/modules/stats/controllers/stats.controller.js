import StatsService from '../services/stats.service.js';

class StatsController {
  async getCommunityStats(req, res) {
    try {
      const stats = await StatsService.getCommunityStats();
      res.json(stats);
    } catch (error) {
      console.error('Error getting community stats:', error);
      res.status(500).json({ 
        message: 'Failed to fetch community stats',
        error: error.message 
      });
    }
  }

  async getDashboardStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await StatsService.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      res.status(500).json({ 
        message: 'Failed to fetch dashboard stats',
        error: error.message 
      });
    }
  }
}

export default new StatsController();
