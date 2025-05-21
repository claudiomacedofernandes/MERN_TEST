import 'package:flutter/material.dart';

class CustomBarChart extends StatelessWidget {
  final List<dynamic> values;
  final List<String> labels;
  final double barHeight;
  final double padding;

  const CustomBarChart({
    Key? key,
    required this.values,
    required this.labels,
    this.barHeight = 40.0,
    this.padding = 8.0,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final maxValue =
        values.isNotEmpty ? values.reduce((a, b) => a > b ? a : b) : 1.0;

    return Container(
      padding: EdgeInsets.all(padding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: List.generate(values.length, (index) {
          return Padding(
            padding: EdgeInsets.only(bottom: padding),
            child: CustomBar(
              value: values[index],
              maxValue: maxValue,
              label: labels[index],
              height: barHeight,
            ),
          );
        }),
      ),
    );
  }
}

class CustomBar extends StatelessWidget {
  final double value;
  final double maxValue;
  final String label;
  final double height;

  const CustomBar({
    Key? key,
    required this.value,
    required this.maxValue,
    required this.label,
    required this.height,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final widthFactor = maxValue > 0 ? value / maxValue : 0.0;
    final displayLabel = '$label (${value.toInt()})'; // Include value in label

    return SizedBox(
      height: height,
      child: Stack(
        alignment: Alignment.centerLeft, // Align bar and label to the left
        children: [
          // Bar with minimum width to ensure label visibility
          Container(
            constraints: BoxConstraints(
              minWidth: 250.0, // Minimum width for label visibility
              maxWidth: double.infinity,
            ),
            child: FractionallySizedBox(
              widthFactor: widthFactor,
              alignment: Alignment.centerLeft, // Align bar to the left
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.blue,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
          ),
          // Label
          Positioned(
            left: 0,
            top: 10,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: Text(
                displayLabel,
                style: const TextStyle(
                  color: Colors.black,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
