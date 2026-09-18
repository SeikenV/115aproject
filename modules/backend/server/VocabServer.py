#!/usr/bin/env python3
import os
import shutil

script_path = os.path.abspath(__file__)
server_dir_path = os.path.dirname(script_path)
database_dir_path = os.path.dirname(server_dir_path) + "/database"

# decrypt credentials
import pyzipper


def extract_protected_zip(zip_filename, password, extract_to="."):
    """Extract a password-protected ZIP file."""
    with pyzipper.AESZipFile(zip_filename, "r") as zf:
        zf.setpassword(password.encode("utf-8"))
        zf.extractall(path=extract_to)


zip_file = database_dir_path + "/" + "credential.zip"
password = "arichinmaychristophermingweivenkatesh"
extract_protected_zip(zip_file, password, database_dir_path + "/cfg")
print("Credential decrypted.")


from datetime import datetime
import socket
import threading
import signal
from Server import Server

# Global variable declaration
server_socket = None
termination = False
debug_mode = True
active_users = set()

def signal_handler(signum, frame):
    global termination
    print("Signal received, shutting down server.")
    termination = True
    if server_socket:
        server_socket.close()
        
    delete_files_in_directory(database_dir_path + "/cfg")
    print("Credential deleted.")

def delete_files_in_directory(directory):
    """Delete all files in the specified directory without removing the directory itself."""
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print("Failed to delete %s. Reason: %s" % (file_path, e))


def worker(client_socket, address):
    thread_id = threading.current_thread().ident
    server = Server(client_socket, active_users, debug_mode)
    served_user = server.run()
    client_socket.close()
    if debug_mode:
        print(datetime.now(), f" - Thread: {thread_id} served {served_user}")
        print(datetime.now(), f" - Thread: {thread_id} exit")


if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    signal.signal(signal.SIGQUIT, signal_handler)
    signal.signal(signal.SIGTSTP, signal_handler)

    HOST = ""
    PORT = 8080

    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, PORT))
    server_socket.listen()
    print(
        datetime.now(),
        f" - Server listening on {socket.gethostbyname(socket.gethostname())}:{PORT}",
    )

    while not termination:
        try:
            client_socket, address = server_socket.accept()
            print(datetime.now(), f" - Accepted connection from {address}")
            client_thread = threading.Thread(
                target=worker, args=(client_socket, address)
            )
            client_thread.start()
        except OSError:
            break  # Break from the loop if server_socket is closed by signal handler

    print("Server has been shut down.")
