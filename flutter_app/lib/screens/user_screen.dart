import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../main.dart';

class UserScreen extends StatefulWidget {
  @override
  _UserScreenState createState() => _UserScreenState();
}

class _UserScreenState extends State<UserScreen> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  String? _selectedRole = 'guest';
  String? error;

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    if (auth.userId != null) {
      return Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            if (error != null)
              Padding(
                padding: EdgeInsets.symmetric(vertical: 8.0),
                child: Text(error!, style: TextStyle(color: Colors.red)),
              ),
            Text('Welcome, ${auth.username}!'),
            SizedBox(height: 16),
            DropdownButton<String>(
              value: auth.userRole,
              items: AuthProvider.userRoles
                  .map((role) => DropdownMenuItem(
                        value: role,
                        child: Text(role[0].toUpperCase() + role.substring(1)),
                      ))
                  .toList(),
              onChanged: (value) async {
                try {
                  await auth.updateRole(value!);
                } catch (e) {
                  setState(() => error = 'Role update failed');
                }
              },
            ),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: () async {
                try {
                  await auth.logout();
                } catch (e) {
                  setState(() => error = 'Logout failed');
                }
              },
              child: Text('Logout'),
            ),
          ],
        ),
      );
    }

    return Padding(
      padding: EdgeInsets.all(16.0),
      child: Column(
        children: [
          if (error != null)
            Padding(
              padding: EdgeInsets.symmetric(vertical: 8.0),
              child: Text(error!, style: TextStyle(color: Colors.red)),
            ),
          TextField(
            controller: _usernameController,
            decoration: InputDecoration(labelText: 'Username'),
          ),
          TextField(
            controller: _passwordController,
            decoration: InputDecoration(labelText: 'Password'),
            obscureText: true,
          ),
          DropdownButton<String>(
            value: _selectedRole,
            items: AuthProvider.userRoles
                .map((role) => DropdownMenuItem(
                      value: role,
                      child: Text(role[0].toUpperCase() + role.substring(1)),
                    ))
                .toList(),
            onChanged: (value) => setState(() => _selectedRole = value),
          ),
          SizedBox(height: 16),
          ElevatedButton(
            onPressed: () async {
              try {
                await auth.login(
                    _usernameController.text, _passwordController.text);
                setState(() => error = null);
              } catch (e) {
                setState(() => error = 'Invalid credentials');
              }
            },
            child: Text('Login'),
          ),
          ElevatedButton(
            onPressed: () async {
              try {
                await auth.register(_usernameController.text,
                    _passwordController.text, _selectedRole!);
                setState(() {
                  error = null;
                  _usernameController.clear();
                  _passwordController.clear();
                  _selectedRole = 'guest';
                });
                // Navigate to MainScreen to refresh UI with new auth state
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => MainScreen()),
                );
              } catch (e) {
                setState(() => error = 'Registration failed');
              }
            },
            child: Text('Register'),
          ),
        ],
      ),
    );
  }
}
