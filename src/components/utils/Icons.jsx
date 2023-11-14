/**
 * @file Icons.jsx
 * 
 * Este arquivo agrega todos os ícones que são usados no sistema.
 */

import React from 'react';

import { Icon } from '@chakra-ui/react';
import { PiDiamond, PiTreeStructure, PiTriangle } from 'react-icons/pi';
import { RiAddFill, RiArrowDownDoubleLine, RiArrowDownSFill, RiArrowDownSLine, RiArrowLeftDoubleLine, RiArrowLeftSFill, RiArrowRightDoubleLine, RiArrowRightSFill, RiArrowUpDoubleLine, RiArrowUpSFill, RiCursorLine, RiDatabase2Line, RiDragMoveFill, RiFileTextFill, RiHome4Line, RiPlayLine, RiRectangleLine, RiSeparator, RiSubtractFill, RiTableLine, RiToolsLine } from 'react-icons/ri';
import { TbFileDatabase, TbMicroscope, TbOvalVertical, TbTopologyStar } from 'react-icons/tb';

export function ArrowLeftSIcon(props)
{
  return (
    <Icon as={RiArrowLeftSFill} {...props}/>
  )
}

export function ArrowRightSIcon(props)
{
  return (
    <Icon as={RiArrowRightSFill} {...props}/>
  )
}

export function ArrowTopSIcon(props)
{
  return (
    <Icon as={RiArrowUpSFill} {...props}/>
  )
}

export function ArrowBottomSIcon(props)
{
  return (
    <Icon as={RiArrowDownSFill} {...props}/>
  )
}

export function ArrowDownIcon(props)
{
  return (
    <Icon as={RiArrowDownSLine} {...props}/>
  )
}

export function CursorIcon(props)
{
  return (
    <Icon as={RiCursorLine} {...props} />
  )
}

export function DragMoveIcon(props)
{
  return (
    <Icon as={RiDragMoveFill} {...props}/>
  )
}

export function DatabaseIcon(props)
{
  return (
    <Icon as={RiDatabase2Line} {...props}/>
  )
}

export function DiamondIcon(props)
{
  return (
    <Icon as={PiDiamond} {...props}/>
  )
}

export function DoubleArrowRightIcon(props)
{
  return (
    <Icon as={RiArrowRightDoubleLine} {...props}/>
  )
}

export function DoubleArrowLeftIcon(props)
{
  return (
    <Icon as={RiArrowLeftDoubleLine} {...props}/>
  )
}

export function DoubleArrowTopIcon(props)
{
  return (
    <Icon as={RiArrowUpDoubleLine} {...props}/>
  )
}

export function DoubleArrowBottomIcon(props)
{
  return (
    <Icon as={RiArrowDownDoubleLine} {...props}/>
  )
}

export function EllipseIcon(props)
{
  return (
    <Icon as={TbOvalVertical} {...props}/>
  )
}

export function FileDatabaseIcon(props)
{
  return (
    <Icon as={TbFileDatabase} {...props}/>
  )
}

export function FileTextIcon(props)
{
  return (
    <Icon as={RiFileTextFill} {...props}/>
  )
}

export function HomeIcon(props)
{
  return (
    <Icon as={RiHome4Line} {...props}/>
  )
}

export function MinusIcon(props)
{
  return (
    <Icon as={RiSubtractFill} {...props}/>
  )
}

export function ModelingIcon(props)
{
  return (
    <Icon as={PiTreeStructure} {...props}/>
  )
}

export function NetworkIcon(props)
{
  return (
    <Icon as={TbTopologyStar} {...props}/>
  )
}

export function PlayIcon(props)
{
  return (
    <Icon as={RiPlayLine} {...props}/>
  )
}

export function PlusIcon(props)
{
  return (
    <Icon as={RiAddFill} {...props}/>
  )
}

export function RectangleIcon(props)
{
  return (
    <Icon as={RiRectangleLine} {...props}/>
  )
}

export function SeparatorIcon(props)
{
  return (
    <Icon as={RiSeparator} {...props}/>
  )
}

export function ToolsIcon(props)
{
  return (
    <Icon as={RiToolsLine} {...props}/>
  )
}

export function TriangleIcon(props)
{
  return (
    <Icon as={PiTriangle} {...props}/>
  )
}

export function TableIcon(props)
{
  return (
    <Icon as={RiTableLine} {...props}/>
  )
}

export function LabIcon(props)
{
  return (
    <Icon as={TbMicroscope} {...props}/>
  )
}

export function LogoIcon(props) {
  return (
    <Icon
      viewBox="0 0 1024.0 1024.00"
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
    fill="currentColor" stroke="none">
    <path d="M7269 8166 c-2 -2 -60 -6 -129 -9 -144 -7 -302 -24 -345 -37 -16 -5
    -55 -12 -85 -15 -132 -16 -407 -103 -509 -161 -70 -40 -186 -131 -214 -167
    -64 -85 -62 -65 -65 -494 -2 -231 1 -415 7 -446 11 -62 63 -155 117 -210 42
    -42 255 -151 364 -185 484 -152 1089 -183 1600 -81 201 40 429 111 496 154 11
    7 39 19 63 26 29 9 66 35 121 88 125 120 123 110 128 585 4 488 -5 553 -90
    616 -256 191 -592 290 -1122 330 -127 10 -329 14 -337 6z"/>
    <path d="M2969 7537 l-34 -23 -3 -502 c-2 -454 -1 -505 14 -528 29 -44 63 -54
    184 -54 130 0 160 11 190 70 19 37 20 58 20 345 l0 305 1143 0 c900 0 1147 3
    1167 13 l25 13 3 172 c1 108 -2 180 -8 192 -11 20 -26 20 -1339 20 l-1328 0
    -34 -23z"/>
    <path d="M5930 6476 c0 -7 9 -16 20 -19 11 -3 20 -11 20 -17 0 -9 -4 -9 -16 1
    -13 10 -17 10 -25 -2 -13 -21 -11 -659 2 -738 16 -93 72 -178 158 -242 53 -39
    272 -136 360 -160 42 -11 108 -29 146 -39 220 -59 481 -90 765 -90 344 1 536
    23 815 95 180 47 263 77 383 137 89 44 112 61 168 125 45 50 71 88 80 120 22
    71 20 762 -1 804 l-16 30 -42 -34 c-40 -32 -93 -66 -180 -115 -23 -12 -48 -28
    -56 -36 -21 -18 -260 -138 -336 -169 -247 -101 -571 -167 -810 -167 -117 0
    -383 34 -470 60 -93 27 -274 83 -300 92 -71 25 -287 135 -370 188 -49 31 -117
    72 -150 90 -33 18 -76 48 -95 67 -37 36 -50 41 -50 19z"/>
    <path d="M2880 6204 c-354 -22 -704 -98 -880 -192 -173 -92 -227 -139 -269
    -232 -20 -43 -21 -65 -21 -474 0 -425 0 -429 23 -475 40 -83 120 -152 242
    -210 142 -68 133 -64 255 -101 309 -91 801 -147 1077 -121 311 29 677 96 785
    144 267 119 300 137 346 188 26 29 59 73 74 98 l28 46 0 440 0 440 -24 52
    c-45 95 -90 127 -351 249 -87 41 -391 106 -596 129 -133 14 -565 26 -689 19z"/>
    <path d="M5920 4988 c0 -463 5 -492 113 -599 47 -47 226 -150 337 -193 295
    -115 814 -177 1230 -147 167 12 207 17 380 46 214 35 449 109 540 170 19 12
    53 29 75 36 27 9 64 39 113 89 120 123 113 86 110 542 l-3 393 -22 3 c-19 3
    -48 -14 -238 -137 -22 -14 -42 -29 -45 -33 -3 -4 -37 -21 -75 -39 -39 -17
    -102 -46 -140 -64 -122 -56 -166 -72 -320 -114 -205 -56 -274 -68 -460 -82
    -170 -12 -334 -4 -520 25 -103 17 -390 97 -451 126 -22 11 -43 20 -47 20 -14
    0 -223 104 -272 135 -175 111 -284 175 -299 175 -3 0 -6 -158 -6 -352z"/>
    <path d="M1710 4492 c-1 -15 0 -195 0 -401 1 -405 0 -399 59 -485 34 -50 137
    -122 239 -167 37 -16 74 -34 83 -39 32 -17 267 -80 375 -101 171 -32 294 -47
    492 -60 252 -17 466 -2 813 60 158 27 423 108 479 145 19 13 65 40 102 60 116
    63 137 88 174 206 11 35 14 128 14 429 l0 384 -34 -6 c-47 -8 -144 -57 -211
    -109 -144 -109 -369 -220 -570 -281 -464 -141 -856 -128 -1335 41 -123 44
    -403 196 -501 273 -37 29 -64 42 -136 65 l-43 13 0 -27z"/>
    <path d="M6282 3821 c-116 -9 -112 2 -112 -322 l0 -269 -596 -2 -595 -3 -19
    -25 c-17 -22 -20 -43 -20 -173 l0 -149 29 -29 29 -29 745 0 c735 0 745 0 770
    20 15 12 31 38 37 58 6 23 10 197 10 449 l0 412 -22 25 c-16 18 -40 29 -77 36
    -56 10 -60 10 -179 1z"/>
    <path d="M4404 3348 c-58 -47 -204 -139 -244 -153 -23 -8 -69 -28 -103 -44
    -80 -38 -222 -85 -317 -105 -41 -8 -115 -24 -165 -34 -212 -46 -610 -54 -820
    -18 -349 61 -632 160 -839 292 -92 59 -104 64 -155 64 l-56 0 3 -371 c3 -422
    -1 -401 90 -500 114 -124 458 -256 782 -299 47 -6 101 -16 120 -21 55 -16 567
    -23 700 -10 455 44 682 102 920 234 81 45 114 70 146 110 78 98 74 73 74 492
    l0 375 -24 0 c-13 0 -37 3 -53 6 -22 4 -37 0 -59 -18z"/>
    <path d="M10080 80 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"/>
    </g>
    </Icon>
  )
}