# Humax C1 Channel Manager

A modern **React + TypeScript + Tailwind CSS** web app for importing, viewing, reorganizing, and exporting **Humax C1 `.db` channel backup files**.

This tool is designed to make channel management easier by providing a clean UI for:

- importing Humax `.db` backup files
- browsing channels by provider, LCN range, and type
- searching and filtering channels
- editing LCN values for editable channels
- moving channels up/down or inserting them into target LCN positions
- exporting the modified `.db` file
- exporting channel data as CSV

---

## Features

- **Import `.db` backup files**
- **Automatic decompression** using `pako`
- **Channel parsing and provider extraction**
- **Editable LCN management**
- **TV / Radio / HD / Changed / Editable filters**
- **Provider-based sidebar navigation**
- **LCN range navigation**
- **CSV export**
- **Modified `.db` export**
- **Modern UI**
- **Built with TypeScript for safer maintenance**

---

## Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **pako**
- **clsx**
- **lucide-react** (optional UI icons)

---

## Screenshots

![App Screenshot](./src/assets/image.png)