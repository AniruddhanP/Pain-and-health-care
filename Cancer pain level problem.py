import datetime
import pandas as pd
import matplotlib.pyplot as plt
from collections import defaultdict
import random

# Data structure for a single pain episode
class PainEpisode:
    def __init__(self, pain_level, cause=None, cure=None, pre_injection_pain=None, post_injection_pain=None, injection_time=None):
        self.pain_level = pain_level
        self.timestamp = datetime.datetime.now()
        self.cause = cause
        self.cure = cure
        self.pre_injection_pain = pre_injection_pain
        self.post_injection_pain = post_injection_pain
        self.injection_time = injection_time

# Class to manage all patient data
class Patient:
    def __init__(self, name):
        self.name = name
        self.pain_log = []
        self.exercise_completed = False
username=Patient(input("enter name"))
password=random.randint(100000,999999)
print(password)
# Initialize a patient instance
current_patient = Patient("Patient Name")

def record_pain_episode():
    """Records a new pain episode with the current timestamp."""
    try:
        pain = int(input("Enter pain level (0-10): "))
        if 0 <= pain <= 10:
            episode = PainEpisode(pain_level=pain)
            current_patient.pain_log.append(episode)
            print("Pain episode recorded.\n")
        else:
            print("Invalid pain level. Please enter a number between 0 and 10.\n")
    except ValueError:
        print("Invalid input. Please enter a number.\n")

def add_doctors_notes():
    """Adds cause, cure, and injection details to the most recent episode."""
    if not current_patient.pain_log:
        print("No pain episodes to add notes to.\n")
        return

    last_episode = current_patient.pain_log[-1]
    last_episode.cause = input("Enter the cause of the episode (from patient): ")
    last_episode.cure = input("Enter what cured the episode (from doctor): ")

    injection_q = input("Was an injection given? (yes/no): ").lower()
    #if (injection_q != "yes" or "no"):
    #    print("invalid text")
    if injection_q == "yes":
        try:
            pre_pain = int(input("Pain level before injection: "))
            post_pain = int(input("Pain level after injection: "))
            if 0 <= pre_pain <= 10 and 0 <= post_pain <= 10:
                last_episode.pre_injection_pain = pre_pain
                last_episode.post_injection_pain = post_pain
                last_episode.injection_time = datetime.datetime.now()
                if(pre_pain>post_pain):
                    print("Alert!")
                else: #last_episode.injection_time = datetime.datetime.now()
                  print("Injection details recorded.\n")

                if (last_episode.timestamp + datetime.timedelta(hours=1)) < last_episode.injection_time:
                    print("🚨 ALERT: Pain lasted more than an hour after medication. Alerting doctors!")
    
        except ValueError:
           print("Invalid input. Please enter numbers.")
    if injection_q == "no":        
            print("Invalid pain levels for injection notes.")
    if (injection_q != 'yes' or 'no'):
        print('invalid input')


def analyze_pain():
    """Performs analysis on pain levels and episodes from the last 7 days."""
    if not current_patient.pain_log:
        print("No data to analyze.\n")
        return

    episodes_last_7_days = [
        e for e in current_patient.pain_log
        if (datetime.datetime.now() - e.timestamp).days <= 7
    ]

    if not episodes_last_7_days:
        print("Not enough data in the last 7 days for analysis.\n")
        return

    # Check for sudden pain spikes
    if len(episodes_last_7_days) >= 4:
        last_episode = episodes_last_7_days[-1]
        previous_three_avg = sum(e.pain_level for e in episodes_last_7_days[-4:-1]) / 3
        if last_episode.pain_level > previous_three_avg + 3:
            print(" ALERT: Sudden spike in pain levels detected!")

    # Check for recurring episode times
    hourly_counts = defaultdict(int)
    for episode in episodes_last_7_days:
        hourly_counts[episode.timestamp.hour] += 1
    
    sorted_hours = sorted(hourly_counts.items(), key=lambda item: item[1], reverse=True)
    if sorted_hours and sorted_hours[0][1] >= 3:
        peak_hour = sorted_hours[0][0]
        print(f" Pain episodes frequently happen around {peak_hour}:00. Staff should take extra care of the patient during this period.")
    
    # Categorize patient status
    total_pain = sum(e.pain_level for e in episodes_last_7_days)
    avg_pain = total_pain / len(episodes_last_7_days)
    print(f"Average pain level over the last 7 days: {avg_pain:.2f}")

    if avg_pain >= 7:
        print(" Patient is categorized as **SEVERE**. Immediate special care is advised.")
    else:
        print(" Patient's condition is stable or improving.")

def plot_pain_correlation():
    """Generates a scatter plot of daily pain vs. episode frequency."""
    if not current_patient.pain_log:
        print("No data to plot.\n")
        return
    
    daily_data = defaultdict(lambda: {'pain_levels': [], 'episode_count': 0})
    for episode in current_patient.pain_log:
        day_str = episode.timestamp.strftime('%Y-%m-%d')
        daily_data[day_str]['pain_levels'].append(episode.pain_level)
        daily_data[day_str]['episode_count'] += 1

    
    avg_pains = [sum(data['pain_levels']) / len(data['pain_levels']) for data in daily_data.values()]
    episode_counts = [data['episode_count'] for data in daily_data.values()]
    dates = [episode.timestamp for episode in current_patient.pain_log]
    pain_levels = [episode.pain_level for episode in current_patient.pain_log]

    if len(avg_pains) <= 0:
        print("Not enough data to create a meaningful plot.\n")
        return

    plt.figure(figsize=(10, 6))
    plt.scatter(episode_counts, pain_levels, c=len(dates), cmap='viridis', s=100)
    plt.colorbar(label='Average Pain Level')
    plt.xlabel('Daily Episode Frequency')
    plt.ylabel('Average Daily Pain Level')
    plt.title('Pain Levels vs. Episode Frequency')
    plt.grid(True)
    plt.show()

def track_exercises():
    """Records and reminds the patient about their exercises."""
    answer = input("Has the patient completed their exercises today? (yes/no): ").lower()
    if answer == 'yes':
        current_patient.exercise_completed = True
        print("Exercise completion recorded.\n")
    else:
        current_patient.exercise_completed = False
        print(" REMINDER: The patient has not yet completed their exercises.")

    

# Main loop
name_1=input("enter name")
p_1=int(input("password"))
if  (name_1==username.name) and (p_1==password):
    
    while True:
        
        print("\n--- Patient Pain Management System ---")
        print("1. Record Pain Episode")
        print("2. Add Doctor's Notes")
        print("3. Analyze Pain and Status")
        print("4. Plot Pain Correlation")
        print("5. Track Exercises")
        print("6. Exit")

        choice = input("Choose an option: ")


        if choice == "1":
           record_pain_episode()
        elif choice == "2":
           add_doctors_notes()
        elif choice == "3":
           analyze_pain()
        elif choice == "4":
          plot_pain_correlation()
        elif choice == "5":
          track_exercises()
        elif choice == "6":
          print("Exiting program.")
          break
        
        else:
          print("Invalid choice. Please try again.")
else:
            print("wrong credentials")
