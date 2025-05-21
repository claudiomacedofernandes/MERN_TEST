import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import '../config.dart';
import '../providers/auth_provider.dart';

class StatisticsScreen extends StatefulWidget {
  @override
  _StatisticsScreenState createState() => _StatisticsScreenState();
}

class _StatisticsScreenState extends State<StatisticsScreen> {
  Map<String, dynamic>? stats;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchStats();
    Future.delayed(Duration(seconds: 30), autoRefresh);
  }

  Future<void> fetchStats() async {
    try {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      if (!auth.canAccessStats()) {
        setState(() => error = 'Insufficient role');
        return;
      }
      final response = await http.get(
        Uri.parse('$SERVER_API/api/stats'),
        headers: {'Cookie': 'token=${auth.token}'},
      );
      if (response.statusCode == 200) {
        setState(() {
          stats = jsonDecode(response.body)['stats'];
          error = null;
        });
      } else {
        setState(() => error = 'Failed to load statistics');
      }
    } catch (e) {
      setState(() => error = 'Failed to load statistics');
    }
  }

  Future<void> autoRefresh() async {
    while (mounted) {
      await fetchStats();
      await Future.delayed(Duration(seconds: 30));
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    if (!auth.canAccessStats()) {
      return Center(
          child: Text('Access Denied: Guest role cannot view statistics'));
    }
    if (error != null) {
      return Center(child: Text(error!, style: TextStyle(color: Colors.red)));
    }
    if (stats == null) {
      return Center(child: CircularProgressIndicator());
    }

    return Padding(
      padding: EdgeInsets.all(16.0),
      child: Column(
        children: [
          SizedBox(
            height: 300,
            child: BarChart(
              BarChartData(
                titlesData: FlTitlesData(
                  leftTitles: SideTitles(showTitles: true),
                  bottomTitles: SideTitles(
                    showTitles: true,
                    getTitles: (value) {
                      const titles = [
                        'Photos Added',
                        'Photos Deleted',
                        'Current Photos',
                        'Users Added',
                        'Users Deleted',
                        'Current Users',
                        'Total Logins',
                        'Total Logouts',
                        'Logged In Users',
                      ];
                      return titles[value.toInt()];
                    },
                  ),
                ),
                borderData: FlBorderData(show: true),
                barGroups: [
                  for (int i = 0; i < 9; i++)
                    BarChartGroupData(
                      x: i,
                    barRods: [
                      BarChartRodData(
                          y: [
                            stats!['photosAdded'],
                            stats!['photosDeleted'],
                            stats!['currentPhotos'],
                            stats!['usersAdded'],
                            stats!['usersDeleted'],
                            stats!['currentUsers'],
                            stats!['totalLogins'],
                            stats!['totalLogouts'],
                            stats!['totalLoggedInUsers'],
                          ][i]
                              .toDouble(),
                        colors: [Colors.blue],
                      ),
                    ],
              ),
                ],
              ),
            ),
          ),
          SizedBox(height: 16),
          Text(
              'Last updated: ${DateTime.parse(stats!['updatedAt']).toLocal().toString().split('.')[0]}'),
        ],
      ),
    );
  }
}
