import 'package:flutter/widgets.dart';

const String SERVER_API = "http://192.168.1.101:3001";
const String STORAGE_API = "http://192.168.1.101:3000";
const bool SHOW_DEBUG_ITEMS = true;
ValueNotifier<bool> IS_OFFLINE = ValueNotifier(false);
