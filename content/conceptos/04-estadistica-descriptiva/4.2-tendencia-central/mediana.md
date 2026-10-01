---
id: mediana
titulo: Mediana
titulo_en: Median
alias:
  - valor central
  - percentil 50
  - segundo cuartil
modulo: 4
submodulo: '4.2'
orden: 8
nivel: basico
prerrequisitos:
  - parametro-y-estadistico
  - escalas-nominal-ordinal-de-intervalo-y-de-razon
relaciones:
  - tipo: contrasta
    id: media-aritmetica
etiquetas:
  - tendencia central
  - estadística robusta
  - estadísticos de orden
  - valor central
resumen: >
  La mediana es el valor que deja la mitad de los datos ordenados por debajo y la mitad por encima.
  Solo depende del orden, por lo que resiste los valores extremos y sirve para escalas ordinales.
formula: '\tilde{x} = \begin{cases} x_{((n+1)/2)} & n \text{ impar} \\ \frac{1}{2}\big(x_{(n/2)} + x_{(n/2+1)}\big) & n \text{ par} \end{cases}'
visualizacion:
  componente: DataStrip
  parametros:
    modo: centro
    datos: [1.8, 2.1, 2.4, 2.0, 2.6, 2.2, 1.9]
    medidas: [mediana, media]
    atipico:
      indice: 4
      hasta: 9.5
    variable: Precio de venta de casas en una colonia
    unidad: millones de pesos
    decimales: 1
referencias:
  - clave: degroot
  - clave: wasserman
publicado: true
---

## Intuición

Si se forma a nueve personas por estatura, la del lugar cinco es la de en medio: cuatro son más bajas y cuatro más altas. Esa estatura es la **mediana**. Para encontrarla no hace falta sumar nada; basta ordenar y contar hasta el centro.

Esa sencillez le da una virtud. Si la persona más alta de la fila fuera un jugador de baloncesto de 2.20 m, o si por error se anotara 22 m, la persona de en medio seguiría siendo la misma. La mediana solo pregunta quién está en el centro, no a qué distancia están los demás. Por eso es el resumen preferido para variables donde unos pocos valores enormes son normales, como los precios de las casas o los ingresos: describe al caso típico sin que los extremos lo arrastren. Y como solo usa el orden, también funciona con escalas ordinales, como el nivel de satisfacción.

## Definición

:::definicion[Mediana]
Sean $x_{(1)} \le x_{(2)} \le \dots \le x_{(n)}$ los datos ordenados. La **mediana muestral** es
$$
\tilde{x} = \begin{cases} x_{((n+1)/2)} & \text{si } n \text{ es impar},\\[4pt] \dfrac{x_{(n/2)} + x_{(n/2+1)}}{2} & \text{si } n \text{ es par.} \end{cases}
$$
:::

Con $n$ impar, la mediana es el dato central. Con $n$ par hay dos datos centrales y, por convención, se toma su promedio; cualquier valor entre ellos deja la mitad de los datos a cada lado. Para variables ordinales con $n$ par, si los dos centrales son categorías distintas se reportan ambas.

:::figura[Mediana de datos ordinales: nueve respuestas de satisfacción codificadas de 1 a 5. La quinta respuesta ordenada vale 4; solo se usó el orden de las respuestas.]{componente="DataStrip"}
```yaml
modo: centro
datos: [1, 2, 2, 3, 4, 4, 4, 5, 5]
medidas: [mediana]
variable: Satisfacción con el servicio, de 1 a 5
decimales: 0
dominio: [0.5, 5.5]
```
:::

:::nota[Qué significa cada símbolo]
- $\tilde{x}$: mediana muestral; se lee "x tilde".
- $x_{(k)}$: $k$-ésimo valor al ordenar los datos de menor a mayor.
- $n$: número de datos.
- $(n+1)/2$: posición del dato central cuando $n$ es impar.
- $n/2$ y $n/2 + 1$: posiciones de los dos datos centrales cuando $n$ es par.
:::

## Cómo usar la visualización

Los círculos son precios de siete casas vendidas en una colonia. Primero aparecen uno por uno y el encabezado indica qué dato ordenado es el central. Después, una de las casas se convierte en una residencia de lujo y su precio se desliza hasta 9.5 millones.

Durante el deslizamiento, la media sube de 2.14 a 3.13 millones, por encima de seis de las siete casas, mientras que la mediana se queda en 2.1. Al arrastrar cualquier casa sin cambiarla de lado respecto a la mediana, esta no se mueve; solo cambia si un punto cruza al otro lado del centro.

## Ejemplo

Un biólogo mide la longitud de seis peces de una laguna: 34, 41, 29, 52, 38 y 45 cm.

1. Ordenar: 29, 34, 38, 41, 45, 52.
2. Como $n = 6$ es par, los datos centrales son el tercero y el cuarto: $x_{(3)} = 38$ y $x_{(4)} = 41$.
3. Mediana: $\tilde{x} = (38 + 41)/2 = 39.5$ cm.
4. Tres peces miden menos de 39.5 cm y tres miden más.
5. La media es $239/6 \approx 39.83$ cm, muy cercana porque los datos no tienen valores extremos.

:::figura[Las longitudes del ejemplo. Con seis datos, la mediana es el promedio del tercero y el cuarto ordenados.]{componente="DataStrip"}
```yaml
modo: centro
datos: [34, 41, 29, 52, 38, 45]
medidas: [mediana, media]
variable: Longitud del pez
unidad: cm
decimales: 0
dominio: [25, 56]
```
:::

## Propiedades

- **Minimiza las distancias absolutas:** la mediana es un valor $c$ que hace mínima $\sum |x_i - c|$, así como la media minimiza la suma de cuadrados.
- **Resistencia máxima:** se pueden alterar casi la mitad de los datos sin que la mediana se vaya al infinito; su punto de ruptura es 50 %.
- **Equivarianza monótona:** si $g$ es creciente, la mediana de $g(x_i)$ es $g(\tilde{x})$ (para $n$ impar). Por ejemplo, la mediana del logaritmo es el logaritmo de la mediana.
- **Media y mediana en la forma:** en distribuciones con cola larga a la derecha la media suele superar a la mediana; con cola a la izquierda ocurre lo contrario.

:::demostracion
Distancias absolutas: si $c$ está a la izquierda de la mediana y se mueve un poco a la derecha, se acerca a más de la mitad de los datos y se aleja de menos de la mitad, de modo que $\sum |x_i - c|$ disminuye. El argumento simétrico vale a la derecha. Por lo tanto el mínimo se alcanza cuando hay tantos datos a cada lado de $c$ como sea posible: en la mediana.
:::

:::figura[Propiedad de forma: tiempos de entrega de diez pedidos con cola larga a la derecha. La mediana, 4.5 días, describe el pedido típico; la media, 7.9, se desplaza hacia los pedidos tardíos.]{componente="DataStrip"}
```yaml
modo: centro
datos: [2, 3, 3, 4, 4, 5, 6, 9, 15, 28]
medidas: [mediana, media]
variable: Tiempo de entrega
unidad: días
decimales: 0
```
:::

## Errores comunes

- **Olvidar ordenar.** La mediana es el dato central de la lista ordenada, no el que está en medio de la lista en el orden en que se capturó.
- **Confundirla con el centro del rango.** La mediana no es $(\min + \max)/2$; eso es el [[rango-medio]], que depende solo de los dos extremos.
- **Creer que la mediana ignora los datos.** Usa todos para ordenarlos; lo que ignora es la magnitud de las distancias. Por eso es menos eficiente que la media cuando los datos son normales y sin atípicos.

:::figura[Mediana frente a rango medio en los tiempos de entrega: la mediana es 4.5 días, mientras que el centro del rango, (2 + 28)/2 = 15 días, queda donde casi no hay pedidos.]{componente="DataStrip"}
```yaml
modo: centro
datos: [2, 3, 3, 4, 4, 5, 6, 9, 15, 28]
medidas: [mediana, rango-medio]
variable: Tiempo de entrega
unidad: días
decimales: 0
```
:::

## Conexiones

La mediana se contrasta con la [[media-aritmetica]]: una minimiza distancias absolutas y la otra cuadradas. Es el límite de la [[media-recortada]] cuando el recorte se acerca al 50 % y requiere al menos una [[escalas-nominal-ordinal-de-intervalo-y-de-razon|escala ordinal]]. Como [[parametro-y-estadistico|estadístico]] es el cuantil 0.5, el segundo cuartil y el percentil 50, y su versión para medir dispersión es la desviación absoluta mediana.

## Formulario

:::formula[Mediana con n impar]
$$
\tilde{x} = x_{((n+1)/2)}
$$

- $x_{(k)}$: $k$-ésimo dato ordenado.
- $n$: número de datos.
:::

:::formula[Mediana con n par]
$$
\tilde{x} = \frac{x_{(n/2)} + x_{(n/2+1)}}{2}
$$

- $x_{(n/2)}, x_{(n/2+1)}$: los dos datos centrales.
:::

:::formula[Propiedad de mínimo]
$$
\tilde{x} \in \arg\min_{c} \sum_{i=1}^{n} |x_i - c|
$$

- $c$: candidato a valor central.
- $|x_i - c|$: distancia absoluta de cada dato a $c$.
:::
