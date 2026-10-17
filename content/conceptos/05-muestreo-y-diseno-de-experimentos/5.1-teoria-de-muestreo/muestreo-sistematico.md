---
id: muestreo-sistematico
titulo: Muestreo sistemático
titulo_en: Systematic sampling
alias:
  - muestreo sistemático con arranque aleatorio
  - muestreo de 1 en k
modulo: 5
submodulo: '5.1'
orden: 7
nivel: basico
prerrequisitos:
  - muestreo-aleatorio-simple
relaciones:
  - tipo: relacionado
    id: muestreo-estratificado
etiquetas:
  - intervalo de muestreo
  - arranque aleatorio
  - periodicidad
  - listas ordenadas
resumen: >
  Se elige al azar un punto de arranque entre las primeras k unidades de una lista y después una de
  cada k. Es fácil de aplicar en campo y reparte la muestra a lo largo de la lista, pero falla si la
  lista tiene un ciclo que coincide con k.
formula: 'k = \frac{N}{n}, \qquad \mathcal{S} = \{r,\ r + k,\ r + 2k,\ \dots,\ r + (n-1)k\}'
visualizacion:
  componente: SurveySampler
  parametros:
    diseno: sistematico
    disenos: [sistematico, mas]
    n: 24
    comparar: true
    repeticiones: 400
    poblacion:
      columnas: 20
      filas: 12
      estratos:
        - nombre: Enero a marzo
          media: 3200
        - nombre: Abril a junio
          media: 4100
        - nombre: Julio a septiembre
          media: 5600
        - nombre: Octubre a diciembre
          media: 7400
      desviacion: 900
      icc: 0.1
      minimo: 200
      decimales: 0
      variable: Monto de la factura
      unidad: pesos
      nombreUnidad: Factura
referencias:
  - clave: lohr
    capitulo: '2'
publicado: true
---

## Intuición

Un auditor tiene 240 facturas archivadas por fecha y quiere revisar 24. En lugar de sortear 24 números distintos, sortea un número entre 1 y 10, digamos el 4, y revisa las facturas 4, 14, 24, 34 y así hasta el final. Solo hubo un sorteo, y sin embargo cada factura tenía la misma probabilidad de ser revisada: una entre diez.

Ese es el **muestreo sistemático**. Además de ser cómodo (en una fila de clientes basta contar de diez en diez), tiene una ventaja escondida: como las facturas están ordenadas por fecha, la muestra cubre todos los meses del año de manera pareja, igual que si se hubiera estratificado por trimestre. Su riesgo también viene del orden. Si la lista tiene un ciclo, por ejemplo una factura grande cada diez porque cada décima es de un cliente mayorista, un intervalo de 10 puede caer siempre en las grandes o nunca, y la estimación queda muy lejos del valor real.

## Definición

:::definicion[Muestreo sistemático con arranque aleatorio]
Sea una lista de $N$ unidades y un tamaño de muestra $n$, con intervalo $k = N/n$. Se elige un arranque $r$ uniforme en $\{1, \dots, k\}$ (o en $[0, k)$ si $k$ no es entero) y la muestra es
$$
\mathcal{S} = \{r,\ r + k,\ r + 2k,\ \dots,\ r + (n-1)k\}.
$$
:::

Cada unidad tiene probabilidad de inclusión $\pi_i = 1/k = n/N$, como en el muestreo aleatorio simple, y la media muestral $\bar{y}_{sis}$ es insesgada. Pero solo hay $k$ muestras posibles, no $\binom{N}{n}$, y la varianza es
$$
\operatorname{Var}(\bar{y}_{sis}) = \frac{1}{k}\sum_{r=1}^{k}\left(\bar{y}_r - \bar{Y}\right)^2,
$$
donde $\bar{y}_r$ es la media de la muestra que empieza en $r$. Como la muestra se obtiene con un solo sorteo, no existe un estimador insesgado de esta varianza a partir de una sola muestra.

:::nota[Qué significa cada símbolo]
- $N$: unidades de la lista; $n$: tamaño de muestra.
- $k = N/n$: intervalo de muestreo.
- $r$: arranque aleatorio.
- $\mathcal{S}$: muestra sistemática.
- $\pi_i$: probabilidad de inclusión de la unidad $i$.
- $\bar{y}_r$: media de la muestra con arranque $r$; $\bar{Y}$: media de la población.
:::

## Cómo usar la visualización

Las 240 facturas se leen en orden, fila por fila, de enero (arriba) a diciembre (abajo); el tono indica el monto. Al reproducir se elige un arranque y se toma una de cada $k = 10$; la línea punteada recorre la muestra en el orden de la lista. El histograma naranja acumula las estimaciones y la línea negra las de un muestreo aleatorio simple.

Experimentos sugeridos:

- Observa que cada trimestre recibe siempre seis facturas y que el histograma es más angosto que el del muestreo aleatorio simple.
- Cambia $n$ a 20: el intervalo pasa a 12 y cada fila aporta un número distinto de facturas.
- Cambia el diseño a muestreo aleatorio simple y observa cómo la muestra a veces se amontona en unos meses.

## Ejemplo

Una tienda tiene $N = 1200$ tickets de un día y quiere revisar $n = 60$.

1. Intervalo: $k = 1200/60 = 20$.
2. Se sortea el arranque entre 1 y 20; sale $r = 7$.
3. La muestra son los tickets 7, 27, 47, ..., $7 + 59 \cdot 20 = 1187$.
4. Cada ticket tenía probabilidad $1/20$ de entrar, y solo había 20 muestras posibles.
5. Si los montos de esos 60 tickets suman 15840 pesos, la estimación del ticket promedio es $15840/60 = 264$ pesos.

:::figura[Una muestra sistemática de 24 facturas: la línea punteada recorre las facturas elegidas, separadas por el mismo intervalo en la lista.]{componente="SurveySampler"}
```yaml
diseno: sistematico
n: 24
repeticiones: 1
poblacion:
  columnas: 20
  filas: 12
  estratos:
    - nombre: Enero a marzo
      media: 3200
    - nombre: Abril a junio
      media: 4100
    - nombre: Julio a septiembre
      media: 5600
    - nombre: Octubre a diciembre
      media: 7400
  desviacion: 900
  icc: 0.1
  minimo: 200
  decimales: 0
  variable: Monto de la factura
  unidad: pesos
  nombreUnidad: Factura
```
:::

## Propiedades

- **Mismas probabilidades de inclusión que el muestreo aleatorio simple**, $\pi_i = n/N$, pero probabilidades conjuntas muy distintas: dos unidades a distancia que no es múltiplo de $k$ nunca salen juntas.
- **En listas ordenadas por una variable relacionada con $y$**, actúa como una estratificación implícita y suele ser más preciso que el muestreo aleatorio simple.
- **En listas en orden aleatorio** su varianza es, en promedio, la del muestreo aleatorio simple.
- **En listas con un ciclo de periodo $k$ o divisor de $k$**, todas las unidades de la muestra quedan en la misma fase del ciclo y la varianza puede ser enorme.

:::figura[Propiedad con lista en orden aleatorio: pacientes registrados al azar en una clínica. El sistemático y el aleatorio simple dan histogramas casi iguales.]{componente="SurveySampler"}
```yaml
diseno: sistematico
n: 24
comparar: true
repeticiones: 400
poblacion:
  columnas: 20
  filas: 12
  estratos:
    - nombre: Registro
      media: 118
  desviacion: 14
  icc: 0
  decimales: 0
  variable: Presión sistólica
  unidad: mmHg
  nombreUnidad: Paciente
```
:::

## Errores comunes

- **Elegir un intervalo que coincide con un ciclo de la lista.** Si la lista alterna por turnos, por días de la semana o por posiciones en una caja, el intervalo puede caer siempre en el mismo punto del ciclo.
- **Tratar la muestra como aleatoria simple para estimar la varianza.** La fórmula del muestreo aleatorio simple sobrestima la varianza en listas ordenadas y la subestima en listas periódicas.
- **Elegir el arranque a mano**, por ejemplo siempre el 1. Sin arranque aleatorio no hay probabilidades de inclusión conocidas.

:::figura[Error de intervalo que coincide con un ciclo: en una línea de envasado, 20 boquillas llenan las botellas por turno y cada una tiene su propio ajuste, unas de más y otras de menos. Con 12 botellas el intervalo es 20 y todas salen de la misma boquilla.]{componente="SurveySampler"}
```yaml
diseno: sistematico
disenos: [sistematico, mas]
n: 12
comparar: true
repeticiones: 400
poblacion:
  columnas: 20
  filas: 12
  estratos:
    - nombre: Turno
      media: 500
  desviacion: 2
  icc: 0
  periodo: 20
  amplitud: 6
  decimales: 1
  variable: Contenido de la botella
  unidad: ml
  nombreUnidad: Botella
```
:::

## Conexiones

El muestreo sistemático usa un solo sorteo para producir una muestra con las mismas probabilidades de inclusión que el [[muestreo-aleatorio-simple]]. En listas ordenadas se comporta como un [[muestreo-estratificado]] implícito, y la idea de recorrer una lista con saltos fijos reaparece en el muestreo sistemático con probabilidad proporcional al tamaño. El riesgo de periodicidad conecta con el estudio de ciclos en [[grafico-de-lineas|series ordenadas en el tiempo]].

## Formulario

:::formula[Intervalo y muestra sistemática]
$$
k = \frac{N}{n}, \qquad \mathcal{S} = \{r,\ r + k,\ \dots,\ r + (n-1)k\}
$$

- $N$: tamaño de la lista; $n$: tamaño de muestra.
- $k$: intervalo; $r$: arranque aleatorio entre 1 y $k$.
:::

:::formula[Probabilidad de inclusión]
$$
\pi_i = \frac{1}{k} = \frac{n}{N}
$$

- $\pi_i$: probabilidad de que la unidad $i$ quede en la muestra.
:::

:::formula[Varianza del estimador sistemático]
$$
\operatorname{Var}(\bar{y}_{sis}) = \frac{1}{k}\sum_{r=1}^{k}\left(\bar{y}_r - \bar{Y}\right)^2
$$

- $\bar{y}_r$: media de la muestra que empieza en $r$.
- $\bar{Y}$: media de la población.
:::
