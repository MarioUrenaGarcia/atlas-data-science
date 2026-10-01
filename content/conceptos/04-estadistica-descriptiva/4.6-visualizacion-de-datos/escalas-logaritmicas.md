---
id: escalas-logaritmicas
titulo: Escalas logarítmicas
titulo_en: Logarithmic scales
alias:
  - escala log
  - eje logarítmico
  - gráfico semilogarítmico
modulo: 4
submodulo: '4.6'
orden: 25
nivel: basico
prerrequisitos:
  - grafico-de-lineas
  - funcion-exponencial-y-logaritmo-natural
etiquetas:
  - visualización
  - crecimiento
  - razones
  - órdenes de magnitud
resumen: >
  En una escala logarítmica, distancias iguales representan razones iguales: de 1 a 10 hay lo mismo que
  de 10 a 100. Sirve para datos que abarcan varios órdenes de magnitud y convierte el crecimiento
  exponencial en una recta.
formula: '\text{posición}(y) = \log_{10} y,\qquad \frac{y_2}{y_1} = 10^{\,\text{posición}(y_2) - \text{posición}(y_1)}'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: lineas
    periodos: [Sem 1, Sem 2, Sem 3, Sem 4, Sem 5, Sem 6, Sem 7, Sem 8, Sem 9, Sem 10]
    series:
      - nombre: Ciudad A
        valores: [10, 18, 32, 58, 105, 190, 340, 610, 1100, 1980]
      - nombre: Ciudad B
        valores: [200, 360, 650, 1170, 2100, 3780, 6800, 9500, 11800, 13200]
    variable: Casos acumulados
    escala: logaritmica
referencias:
  - clave: tufte
  - clave: hyndman-fpp
    capitulo: '3'
publicado: true
---

## Intuición

Dos ciudades registran los casos acumulados de una enfermedad durante diez semanas. La ciudad A empieza con 10 casos y la B con 200, pero en ambas los casos crecen cerca de 80 % por semana al principio. En una escala vertical común, la ciudad A queda aplastada contra el piso durante semanas mientras la B se dispara; parece que solo en B pasa algo.

En una **escala logarítmica** el eje se marca 1, 10, 100, 1000, 10000, con la misma distancia entre cada marca. Lo que importa ya no es cuánto se suma sino por cuánto se multiplica: duplicarse de 10 a 20 ocupa el mismo espacio que de 1000 a 2000. Con esa escala, las dos ciudades aparecen como rectas paralelas, porque crecen al mismo ritmo, y se ve con claridad el momento en que la ciudad B empieza a frenar: su línea se curva hacia abajo.

## Definición

:::definicion[Escala logarítmica]
Un eje en **escala logarítmica** de base $b > 1$ coloca cada valor positivo $y$ en la posición

$$
\text{posición}(y) = \log_b y.
$$

En consecuencia, la distancia entre dos valores depende solo de su razón:

$$
\text{posición}(y_2) - \text{posición}(y_1) = \log_b \frac{y_2}{y_1}.
$$

Un gráfico con un solo eje logarítmico se llama **semilogarítmico**; con ambos ejes logarítmicos, **log-log**.
:::

Condiciones:

- Solo se pueden representar valores estrictamente positivos: $\log_b y$ no existe para $y \le 0$.
- Las marcas suelen colocarse en potencias de la base (1, 10, 100) y el eje debe indicar que es logarítmico.

:::nota[Qué significa cada símbolo]
- $b$: base del logaritmo, comúnmente 10 o 2.
- $y$, $y_1$, $y_2$: valores positivos de la variable.
- $\log_b y$: exponente al que hay que elevar $b$ para obtener $y$.
- $y_2 / y_1$: razón entre dos valores.
:::

## Cómo usar la visualización

Las dos series se trazan semana a semana. Con la escala logarítmica el encabezado muestra $\log_{10}$ del último valor de cada ciudad y su cambio semanal; un cambio de 0.30 equivale a duplicarse.

El selector **Escala vertical** cambia entre lineal y logarítmica.

Experimentos sugeridos:

1. Cambiar a escala lineal: la ciudad A parece plana durante seis semanas, aunque crece al mismo ritmo que B.
2. Volver a la logarítmica y comparar los cambios semanales del encabezado al principio: casi iguales en ambas ciudades.
3. Observar las últimas semanas de la ciudad B: su línea se dobla, señal de que el ritmo de crecimiento baja.

## Ejemplo

Posiciones en un eje de base 10:

1. $\log_{10} 10 = 1$, $\log_{10} 100 = 2$, $\log_{10} 1000 = 3$: las marcas quedan equiespaciadas.
2. $\log_{10} 20 \approx 1.301$ y $\log_{10} 2000 \approx 3.301$: duplicar a partir de 10 o a partir de 1000 avanza la misma distancia, $\log_{10} 2 \approx 0.301$.
3. En la ciudad A, de la semana 1 (10 casos) a la semana 2 (18 casos), el avance es $\log_{10}(18/10) \approx 0.255$, que corresponde a un crecimiento de 80 %.
4. Para una tasa de crecimiento constante $g$, la serie $y_t = y_0 (1 + g)^t$ cumple $\log_{10} y_t = \log_{10} y_0 + t \log_{10}(1 + g)$: una recta con pendiente $\log_{10}(1 + g)$.

:::figura[Una serie que se duplica cada periodo, de 1 a 512, en escala logarítmica: una recta con pendiente 0.301 por periodo.]{componente="ChartGallery"}
```yaml
grafico: lineas
periodos: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
series:
  - nombre: Duplicación
    valores: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]
variable: Cantidad
escala: logaritmica
```
:::

## Propiedades

- **Razones iguales, distancias iguales:** la escala logarítmica compara cambios relativos.
- **Crecimiento exponencial como recta:** en un gráfico semilogarítmico la pendiente es el logaritmo del factor de crecimiento por periodo.
- **Varios órdenes de magnitud en un mismo gráfico:** valores de 1 y de un millón caben sin que los pequeños desaparezcan.
- **Simetría multiplicativa:** la mitad y el doble de un valor quedan a la misma distancia de él.

:::figura[Siete órdenes de magnitud: número aproximado de transistores en un procesador de cada década. En escala logarítmica el crecimiento sostenido aparece como una recta; al cambiar a lineal, todo lo anterior a 2010 queda pegado al piso.]{componente="ChartGallery"}
```yaml
grafico: lineas
periodos: ['1970', '1980', '1990', '2000', '2010', '2020']
series:
  - nombre: Transistores por procesador
    valores: [2000, 30000, 1000000, 40000000, 1000000000, 40000000000]
variable: Transistores
escala: logaritmica
```
:::

## Errores comunes

- **Leer distancias como diferencias absolutas.** En escala logarítmica, la misma distancia de 10 a 20 que de 10000 a 20000 representa diferencias absolutas muy distintas.
- **Usarla con ceros o negativos.** Esos valores no tienen logaritmo; sumar una constante arbitraria para evitarlo cambia la forma del gráfico.
- **No señalarla.** Un lector que no advierte la escala logarítmica cree que un crecimiento explosivo es moderado.
- **Usar barras en escala logarítmica.** La longitud de una barra deja de ser proporcional al valor y depende de dónde empiece el eje.

:::figura[Error de lectura: la misma pareja de ciudades en escala lineal. Las diferencias absolutas al final son enormes, aunque en la escala logarítmica las líneas se veían cercanas.]{componente="ChartGallery"}
```yaml
grafico: lineas
periodos: [Sem 1, Sem 2, Sem 3, Sem 4, Sem 5, Sem 6, Sem 7, Sem 8, Sem 9, Sem 10]
series:
  - nombre: Ciudad A
    valores: [10, 18, 32, 58, 105, 190, 340, 610, 1100, 1980]
  - nombre: Ciudad B
    valores: [200, 360, 650, 1170, 2100, 3780, 6800, 9500, 11800, 13200]
variable: Casos acumulados
escala: lineal
```
:::

## Conexiones

La escala logarítmica aplica la [[funcion-exponencial-y-logaritmo-natural|función logaritmo]] a un eje y es la compañera natural del [[grafico-de-lineas]] para series que crecen en forma multiplicativa, como las que se modelan con la [[media-geometrica]]. Ocultarla o usarla con barras la convierte en uno de los [[graficos-enganosos]].

## Formulario

:::formula[Posición en el eje]
$$
\text{posición}(y) = \log_b y,\qquad y > 0
$$

- $b$: base; $y$: valor positivo de la variable.
:::

:::formula[Distancia entre dos valores]
$$
\log_b y_2 - \log_b y_1 = \log_b \frac{y_2}{y_1}
$$

- $y_1$, $y_2$: dos valores positivos; la distancia depende solo de su razón.
:::

:::formula[Crecimiento con tasa constante]
$$
y_t = y_0 (1 + g)^t \ \Longrightarrow\ \log_{10} y_t = \log_{10} y_0 + t\,\log_{10}(1 + g)
$$

- $y_0$: valor inicial; $g$: tasa de crecimiento por periodo; $t$: número de periodos.
- $\log_{10}(1 + g)$: pendiente de la recta en escala semilogarítmica.
:::

:::formula[Tasa a partir de la pendiente]
$$
g = 10^{m} - 1
$$

- $m$: pendiente en escala $\log_{10}$ por periodo; $g$: tasa de crecimiento por periodo.
:::
