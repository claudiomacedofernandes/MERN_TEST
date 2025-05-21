import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

const String SERVER_API = "http://192.168.1.101:3001";

class AuthProvider with ChangeNotifier {
  String? _token;
  String? _userId;
  String? _username;
  String? _userRole;
  static const List<String> userRoles = [
    'superadmin',
    'admin',
    'user',
    'guest'
  ];

  String? get token => _token;
  String? get userId => _userId;
  String? get username => _username;
  String? get userRole => _userRole;

  AuthProvider() {
    _loadAuthData();
  }

  Future<void> _loadAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
    _userId = prefs.getString('userId');
    _username = prefs.getString('username');
    _userRole = prefs.getString('userRole');
    notifyListeners();
  }

  Future<void> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('${SERVER_API}/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body)['user'];
      _token = data['token'];
      _userId = data['userid'];
      _username = data['username'];
      _userRole = data['userrole'];
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', _token!);
      await prefs.setString('userId', _userId!);
      await prefs.setString('username', _username!);
      await prefs.setString('userRole', _userRole!);
      notifyListeners();
    } else {
      throw Exception('Login failed');
    }
  }

  Future<void> register(String username, String password, String role) async {
    final response = await http.post(
      Uri.parse('${SERVER_API}/api/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(
          {'username': username, 'password': password, 'role': role}),
    );

    if (response.statusCode == 201) {
      final data = jsonDecode(response.body)['user'];
      _token = data['token'];
      _userId = data['userid'];
      _username = data['username'];
      _userRole = data['userrole'];
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', _token!);
      await prefs.setString('userId', _userId!);
      await prefs.setString('username', _username!);
      await prefs.setString('userRole', _userRole!);
      notifyListeners();
    } else {
      throw Exception('Registration failed');
    }
  }

  Future<void> updateRole(String role) async {
    final response = await http.put(
      Uri.parse('${SERVER_API}/api/auth/update-role'),
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'token=$_token',
      },
      body: jsonEncode({'role': role}),
    );

    if (response.statusCode == 200) {
      _userRole = jsonDecode(response.body)['user']['userrole'];
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('userRole', _userRole!);
      notifyListeners();
    } else {
      throw Exception('Role update failed');
    }
  }

  Future<void> logout() async {
    final response = await http.get(
      Uri.parse('${SERVER_API}/api/auth/logout'),
      headers: {'Cookie': 'token=$_token'},
    );

    if (response.statusCode == 200) {
      _token = null;
      _userId = null;
      _username = null;
      _userRole = null;
      final prefs = await SharedPreferences.getInstance();
      await prefs.clear();
      notifyListeners();
    } else {
      throw Exception('Logout failed');
    }
  }

  bool canAccessStats() => _userRole != null && _userRole != 'guest';
  bool canUploadPhoto() => _userRole != null && _userRole != 'guest';
  bool canDeletePhoto(String photoUserId, String photoUserRole) {
    if (_userId == null || _userRole == null) return false;
    if (_userId == photoUserId) return true;
    final userRoleIndex = userRoles.indexOf(_userRole!);
    final ownerRoleIndex = userRoles.indexOf(photoUserRole);
    return userRoleIndex < ownerRoleIndex;
  }
}
