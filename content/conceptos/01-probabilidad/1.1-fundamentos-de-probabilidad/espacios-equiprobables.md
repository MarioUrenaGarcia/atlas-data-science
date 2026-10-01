---
id: espacios-equiprobables
titulo: Espacios equiprobables
titulo_en: Equally likely outcomes
alias:
  - espacio uniforme
  - modelo equiprobable
  - resultados igualmente probables
modulo: 1
submodulo: '1.1'
orden: 10
nivel: basico
prerrequisitos:
  - interpretacion-clasica
  - axiomas-de-kolmogorov
  - combinaciones
etiquetas:
  - equiprobabilidad
  - conteo
  - simetría
  - muestreo al azar
resumen: >
  Espacio muestral finito en el que todos los resultados tienen la misma probabilidad, 1 entre el
  número de resultados. Calcular la probabilidad de un evento se reduce a contar sus elementos.
formula: 'P(\{\omega\}) = \frac{1}{|\Omega|}, \qquad P(A) = \frac{|A|}{|\Omega|}'
visualizacion:
  componente: SampleSpaceLab
  parametros:
    modo: eventos
    experimento: cuatro-monedas
    eventoA: exactamente-dos-caras
    eventos: [exactamente-dos-caras, exactamente-una-cara, mas-caras, cara-seguida, todas-iguales]
    operaciones: [A]
referencias:
  - clave: ross-probabilidad
    capitulo: '2.5'
  - clave: blitzstein-hwang
    capitulo: '1.4'
publicado: true
---

## Intuición

Cuando una lotería extrae bolas de una tómbola bien mezclada, cualquier combinación tiene la misma oportunidad. Cuando un estudio elige al azar a 50 personas de una lista, cualquier grupo de 50 tiene la misma probabilidad de ser el elegido. En estas situaciones el modelo natural es un espacio equiprobable: todos los resultados valen lo mismo, y la probabilidad de un evento es la proporción de resultados que lo cumplen.

La dificultad no está en la fórmula, sino en elegir un espacio muestral cuyos resultados realmente sean igualmente probables. Al lanzar cuatro monedas, las 16 secuencias ordenadas de caras y cruces lo son; los cinco valores posibles del número de caras (0, 1, 2, 3 o 4) no lo son. La regla es describir el experimento con el detalle suficiente para que la simetría física se traslade a los resultados.

Una vez elegido el espacio, todo el trabajo es contar, y para eso sirven las herramientas de la combinatoria: el principio del producto, las permutaciones y las combinaciones.

## Definición

:::definicion[Espacio equiprobable]
Un espacio de probabilidad con $\Omega$ finito es **equiprobable** (o uniforme) si todos los resultados tienen la misma probabilidad:

$$
P(\{\omega\}) = \frac{1}{|\Omega|} \quad \text{para todo } \omega \in \Omega.
$$

En ese caso, para todo evento $A \subseteq \Omega$,

$$
P(A) = \sum_{\omega \in A} \frac{1}{|\Omega|} = \frac{|A|}{|\Omega|}.
$$

:::

La segunda igualdad no es una definición adicional, sino una consecuencia de la aditividad: es la regla de Laplace deducida de los axiomas. Un espacio infinito numerable no puede ser equiprobable, porque una suma infinita de términos iguales no puede valer 1.

:::figura[Un dado equilibrado como espacio equiprobable: las seis barras miden 1/6. La animación apila las tres caras pares y obtiene 3/6 = 1/2.]{componente="SampleSpaceLab"}

```yaml
modo: medida
experimento: dado
eventoA: par
eventos: [par, primo, mayor-que-4]
```

:::

:::nota[Qué significa cada símbolo]

- $\Omega$: espacio muestral finito; $|\Omega|$: su número de resultados.
- $\omega$: un resultado; $\{\omega\}$: el evento formado solo por ese resultado.
- $P(\{\omega\})$: probabilidad de ese resultado.
- $A$: evento; $|A|$: número de resultados que contiene.
- $\sum_{\omega \in A}$: suma sobre los resultados de $A$.
- $\binom{n}{k}$: coeficiente binomial, número de formas de elegir $k$ objetos de $n$ sin importar el orden.
:::

## Cómo usar la visualización

La rejilla contiene las 16 secuencias de cuatro lanzamientos de moneda: las filas dan las dos primeras monedas y las columnas las dos últimas. Cada secuencia tiene probabilidad 1/16. El barrido cuenta las secuencias del evento elegido y al final muestra la probabilidad como favorables entre posibles.

"Exactamente dos caras" tiene 6 secuencias, $\binom{4}{2} = 6$, así que su probabilidad es $6/16 = 0.375$. "Exactamente una cara" tiene 4 y "todas las monedas coinciden" solo 2 (CCCC y XXXX). "Aparecen dos caras seguidas" tiene 8: el conteo en la rejilla resulta más fácil que el razonamiento directo.

## Ejemplo

Un comité de 3 personas se elige al azar entre 6 ingenieras y 4 médicos. ¿Cuál es la probabilidad de que el comité tenga exactamente 2 ingenieras?

1. Espacio muestral: todos los grupos de 3 personas de las 10. Como la elección es al azar, son equiprobables. $|\Omega| = \binom{10}{3} = 120$.
2. Evento: elegir 2 de las 6 ingenieras y 1 de los 4 médicos: $|A| = \binom{6}{2}\binom{4}{1} = 15 \cdot 4 = 60$.
3. Probabilidad: $P(A) = 60/120 = 0.5$.
4. Comprobación con el complemento: 0 ingenieras, $\binom{4}{3} = 4$; 1 ingeniera, $6 \cdot \binom{4}{2} = 36$; 3 ingenieras, $\binom{6}{3} = 20$. En total $4 + 36 + 60 + 20 = 120$.

:::figura[Los 120 comités posibles del ejemplo, ordenados por número de ingenieras (I) y médicos (M). Al cambiar el evento, el barrido cuenta 4 comités sin ingenieras, 36 con una, 60 con dos y 20 con tres; los 60 favorables son la mitad del espacio.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: comite
eventoA: ingenieras-2
operaciones: [A]
```

:::

## Propiedades

- **Todo es conteo:** en un espacio equiprobable, $P(A \cup B) = (|A| + |B| - |A \cap B|)/|\Omega|$ y todas las propiedades de la probabilidad se traducen en propiedades de conteo.
- **Productos de espacios equiprobables:** si cada etapa de un experimento compuesto es equiprobable y las etapas no se influyen, el espacio producto también es equiprobable. Por eso los pares ordenados de dos dados valen $1/36$ cada uno.
- **Muestreo al azar:** elegir $k$ elementos de $n$ al azar hace equiprobables los $\binom{n}{k}$ subconjuntos (sin orden) o las $n!/(n-k)!$ secuencias (con orden). Ambos modelos dan la misma probabilidad para eventos que no dependen del orden.
- **Imposible en espacios infinitos numerables:** no existe una probabilidad uniforme sobre $\mathbb{N}$; en espacios continuos la uniformidad se define con longitudes o áreas, como en la [[probabilidad-geometrica]].

:::figura[Producto de espacios equiprobables: 4 palos por 13 valores dan 52 cartas igualmente probables. Los reyes son una columna de 4, con probabilidad 4/52 = 1/13.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: carta
eventoA: rey
eventos: [rey, numero-par, trebol]
operaciones: [A]
```

:::

:::figura[Cuando el modelo equiprobable es correcto, la frecuencia observada se acerca a la proporción de casos: con cuatro monedas, "exactamente dos caras" ocupa 6 de 16 secuencias y la frecuencia se estabiliza en 3/8.]{componente="SampleSpaceLab"}

```yaml
modo: frecuencia
experimento: cuatro-monedas
eventoA: exactamente-dos-caras
eventos: [exactamente-dos-caras]
banda: true
ensayos: 2000
```

:::

## Errores comunes

- **Agrupar resultados y seguir tratándolos como equiprobables.** Al lanzar tres monedas, "0 caras", "1 cara", "2 caras" y "3 caras" no valen 1/4 cada uno: "1 cara" agrupa 3 de las 8 secuencias y "0 caras" solo una.
- **Suponer simetría donde no la hay.** Un dado cargado o una ruleta inclinada no son equiprobables; la regla de conteo da respuestas equivocadas.
- **Mezclar modelos con y sin orden.** Si $|\Omega|$ se cuenta con orden, $|A|$ también debe contarse con orden.

:::figura[Con tres monedas, "exactamente una cara" ocupa 3 de las 8 casillas y "ninguna cara" solo 1: los valores del número de caras no son equiprobables.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: tres-monedas
eventoA: exactamente-una-cara
eventoB: ninguna-cara
operacion: A
operaciones: [A, B]
```

:::

:::figura[Un dado que parece equiprobable pero está cargado: al repetir el lanzamiento, la proporción de seises no se acerca a 1/6. Aquí la cara 6 tiene probabilidad 0.30 y la regla de conteo daría una respuesta equivocada.]{componente="SampleSpaceLab"}

```yaml
modo: medida
experimento: dado
eventoA: seis
eventos: [seis, par]
pesos: [0.14, 0.14, 0.14, 0.14, 0.14, 0.30]
```

:::

## Conexiones

Los espacios equiprobables son el contexto de la [[interpretacion-clasica]] y un caso particular de los [[axiomas-de-kolmogorov]]. Contar en ellos requiere el [[principio-del-producto]], las [[permutaciones]] y las [[combinaciones]]. La [[probabilidad-geometrica]] traslada la idea de uniformidad a regiones continuas, y la distribución uniforme discreta formaliza el caso numérico.

## Formulario

:::formula[Probabilidad de cada resultado]

$$
P(\{\omega\}) = \frac{1}{|\Omega|}
$$

- $|\Omega|$: número total de resultados, todos con la misma probabilidad.
:::

:::formula[Probabilidad de un evento]

$$
P(A) = \frac{|A|}{|\Omega|}
$$

- $|A|$: número de resultados favorables.
:::

:::formula[Muestreo al azar sin orden]

$$
P(A) = \frac{\binom{n_1}{k_1}\binom{n_2}{k_2}}{\binom{n}{k}}
$$

- $n = n_1 + n_2$: tamaño de la población, con $n_1$ elementos de un tipo y $n_2$ de otro.
- $k = k_1 + k_2$: tamaño de la muestra; $k_1$ y $k_2$ son cuántos de cada tipo se piden.
- $\binom{n}{k}$: número de muestras posibles de tamaño $k$.
:::
