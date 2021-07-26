#! /bin/sh
#cd ../data_receiver
#python3 receiver.py &
#cd ../web
#http-server

# Set start time
time_start=$(date -u +"%s")

# Run data receiver in background and store PID
cd ../data_receiver
python3 receiver_i2c.py &
receiver_pid=$!

# Run http-server in background and store PID
cd ../web
http-server -s &
server_pid=$!

while [ true ]; do
    # Read user input inline and store in variable 'cmd'
    read -p "> " cmd
    case $cmd in

        # Stops the server and kills running processes
        "stop")
            echo "Closing processes..."
            kill $server_pid
            kill $receiver_pid # TODO: may need to close this safely to avoid data loss
            # Break out of infinite while loop
            break
            ;;

       # Return server uptime
        "uptime")
            # Store current seconds value (auto incremented since script startup; initialized to 0)
            time_current=$(date -u +"%s")
            duration=$((time_current - time_start))
            echo "Running time: $(($duration / 60))m $(($duration % 60))s"
            ;;

        # Return server stats
	"stats")
		echo "Storage Usage: $(df -h | awk '/root/ {print $3 "/" $2 " (" $5 ")"}')"
		;;

	# Default case
        *)
            echo "Unknown command."
            ;;
    esac
done
echo "Ground station terminated"